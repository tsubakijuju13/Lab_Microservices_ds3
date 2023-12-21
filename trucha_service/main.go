package main

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type pez struct {
	Nombre      string `json:"nombre"`
	Descripcion string `json:"descripcion"`
}

type data struct {
	Data string `json:"data"`
}

var obj_data = [6]data{{Data: ""}}

var p = []interface{}{
	pez{Nombre: "Palometa", Descripcion: "Pescado semi graso con gran cantidad de proteínas"},
	pez{Nombre: "Sardina", Descripcion: "Pez azul rico en omega 3"},
	pez{Nombre: "Anchoas", Descripcion: "Pequeños y con grandes ojos"},
	pez{Nombre: "Caballas", Descripcion: "Alto contenido en purinas"},
	pez{Nombre: "Trucha blanca", Descripcion: "Cocidas al vapor son muy ricas y rapido de preparar"},
	pez{Nombre: "Dorada", Descripcion: "Acumula menos metales pesados que otros pescados"},
}

func get_peces(c *gin.Context) {
	c.IndentedJSON(http.StatusOK, obj_data)
}

func connect_mongo(url string) *mongo.Collection {
	client, err := mongo.Connect(context.TODO(), options.Client().ApplyURI(url))
	if err != nil {
		panic(("Error al realizar la conexion a mongo"))
	}
	coll := client.Database("pez").Collection("peces")

	return coll
}

func insert_mongo(collection *mongo.Collection) {
	op := options.Count().SetHint("_id_")
	count, err := collection.CountDocuments(context.TODO(), bson.D{}, op)

	if err != nil {
		panic(err)
	}

	if count == 0 {
		res, err := collection.InsertMany(context.TODO(), p)

		if err != nil {
			panic("Error al insertar datos")
		}
		fmt.Printf("Peces insertados: %v\n", len(res.InsertedIDs))
	}
}

func search_peces(collection *mongo.Collection) [6]data {
	var peces_data = [6]data{{Data: ""}}
	var index = 0

	cursor, err := collection.Find(context.TODO(), bson.D{})

	if err != nil {
		panic(("Error al buscar los datos"))
	}

	var peces []pez
	if err = cursor.All(context.TODO(), &peces); err != nil {
		panic("Error al decodificar los datos")
	}

	for _, peces_arr := range peces {
		cursor.Decode(&peces_arr)
		out, err := json.MarshalIndent(peces_arr, "", "  ")
		if err != nil {
			panic("Error al codificar los datos en JSON")
		}
		peces_data[index] = data{Data: string(out)}
		index++
	}

	return peces_data
}

func main() {
	// client, err := mongo.Connect(context.TODO(), options.Client().ApplyURI("mongodb://satoru:mongosatoru@mongo:27017"))
	// if err != nil {
	// 	panic(err)
	// }
	// collection := client.Database("pez").Collection("peces")

	collection := connect_mongo("mongodb://satoru:mongosatoru@mongo:27017")
	insert_mongo(collection)
	obj_data = search_peces(collection)

	router := gin.Default()
	router.GET("/peces", get_peces)
	router.Run("0.0.0.0:8088")
}

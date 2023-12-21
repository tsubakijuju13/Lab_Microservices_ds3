const { ApolloServer, AuthenticationError } = require('apollo-server');
const axios = require('axios'); 

const validTokens = [
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkxIiwibmFtZSI6IkphbmUgRG9lIiwiaWF0IjoxNTE2MjM5MDIzfQ.mC0TjRtRVz4uD875aHWhVS3C7O5TMo4igevUOS0kAaM",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkyIiwibmFtZSI6IkppbSBEb2UiLCJpYXQiOjE1MTYyMzkwMjR9.PnY5wuwRohcdEd0lAfzhHlZgCmlWQOKO6fP8GprcFeY",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkzIiwibmFtZSI6Ikpvc2ggRG9lIiwiaWF0IjoxNTE2MjM5MDI1fQ.9VskLxYTZC2xvl7KZ5a3M-ik-0IjOkh-9iP6HvNzMfI",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODk0IiwibmFtZSI6Ikp1ZHkgRG9lIiwiaWF0IjoxNTE2MjM5MDI2fQ.0g2M7uh2rIqA67CLvIpT5aR7Iz-EGt37QJ20qG9G7_w"
  ];



const typeDefs = `
  type Peces {
    nombre: String
    descripcion: String
  }

  type Query {
    service1: [String]
    service2: String
    service3: [String]
  },
`;

const resolvers = {
  Query: {
    service1: async (parent, args, context, info) => {
      try {
        const res = await axios.get('http://salchipapa:5000/comestibles')
        const data = res.data;
        return [...data.papas, ...data.salchichas];
      } catch(err){
        console.error("Error en sachipapas:" + err)
        return []
      }
    },
    service2: async (parent, args, context, info) => {
      try {
        const res = await axios.get('http://cerezas:8080/besos')
        const data = res.data
        var result = "Servicio de besos: "
        for (const [key, value] of Object.entries(data)) {
            result += `Beso ${key} -> ${value}, `
        }
        return result.slice(0, -2)
      }catch(err) {
        console.error("Error en besos:" + err)
        return "Error en conseguir los besos del servicio de cerezas"
      }
    },
    service3: async (parent, args, context, info) => {
      try {
        const arr_data = []
        const res = await axios.get('http://trucha:8088/peces')
        const data = res.data
        for (const k in data)
          arr_data.push(data[k].data)

        return arr_data
      }catch(err){
        return "Error en conseguir los peces del servicio de peces"
      }
    }
  },
};

async function validateAuth({req}) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.split('Bearer ')[1]

  try {
    const res = await axios.post('http://auth:3000/verify-token', { token: token})
    if(res.data && res.data.isValid) {
      return {token}
    } else {
      throw new AuthenticationError("No estas autorizado")
    }
  }catch(err) {
    throw new AuthenticationError("Error al validar el token: " + err)
  }
}

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: validateAuth
  });

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
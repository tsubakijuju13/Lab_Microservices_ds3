FROM tiangolo/uvicorn-gunicorn-fastapi:python3.8
COPY ./salchipapa.py /app/salchipapa.py

CMD ["uvicorn", "salchipapa:app", "--host", "0.0.0.0", "--port", "5000", "--reload"]
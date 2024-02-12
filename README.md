# Toll fee calculator 1.0

A calculator for vehicle toll fees.

- Make sure you read these instructions carefully
- The current code base is in Java and C#, but please make sure that you do an implementation in a language **you feel comfortable** in like Javascript, Python, Assembler or [ModiScript](https://en.wikipedia.org/wiki/ModiScript) (please don't choose ModiScript).

## Background

Our city has decided to implement toll fees in order to reduce traffic congestion during rush hours.
This is the current draft of requirements:

- Fees will differ between 8 SEK and 18 SEK, depending on the time of day
- Rush-hour traffic will render the highest fee
- The maximum fee for one day is 60 SEK
- A vehicle should only be charged once an hour
  - In the case of multiple fees in the same hour period, the highest one applies.
- Some vehicle types are fee-free
- Weekends and holidays are fee-free

## Your assignment

The previous developer quit recently, claiming that this solution is production-ready.
You are now the new developer for our city - congratulations!

Your job is to deliver the code and from now on you are the responsible go-to-person for this solution. This is a solution you will have to put your name on.

## Instructions

You can make any modifications or suggestions for what you see fit. Fork this repository and deliver your results via a pull-request or send us an e-mail. You could also create a gist, for privacy reasons, and send us the link.

## Help I dont know C# or Java

No worries! We accept submissions in other languages as well.

## Solution

For this task I created a simple API using express js and postgreSQL for the backend and Next JS in the frontend.

## Requirements

- Docker
- Node JS (20.10.0 or later)

## Frontend

The app consists of a dashboard that summorizes the sampled data and also routes for the total log and possibility to segment on registration number. This so that you can control that the calculations are correct as well. The app makes simple fetch requests to the api.

In order to start the app, open a new window in the terminal and simply run

```
node run dev
```

Make sure that the backend is running BEFORE running the frontend.

## Backend

The backend is built using the following:

- Express JS
- PostgreSQL

And it runs on

- Docker (docker-compose)

The API has some requests supported that can be accesses with POST and GET Requests. The database requests are built, passed and parsed using Prisma.js. This so that we can have a more readable structure of the data. The reason I went with a db instead of hardcoding is so that we could change the pricing for 2025.

The solution for the toll calculation can be found in the toll_registration_log.js file in the db folder.

In order to run the backend simply open a new terminal window and run

```
docker-compose up --build
```

Also, for this task you will get generated data through the init_db.js file and it will run as soon as express is up and running. You don't have to register any new toll data but in case you want to try it simply send a post request to the following url:

```
POST http://localhost:3000/toll_registration_log

POST DATA
regNr: String (example: ABC123)
vehicleTypeName: String (example: CAR)
date: String (date of registration of toll passing. Example: 2024-02-12T14:30:00)
```

## Todos

In order to publish this to production we would need to add crypto support (check crypto.js) for database information that use sensitive data (reg nr).

For the app we would need to fetch realtime data but also add support to filter and segment out with search bars. We would also need to create an invoicing function so that we could invoice our customers.

Hope you like it! This was a really fun task.

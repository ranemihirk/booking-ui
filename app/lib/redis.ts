"use server";
import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";
import { v4 as uuidv4 } from "uuid";

// Auth
export async function createUser(formData) {
  try {
    const { email, name, password } = Object.fromEntries(formData);
    const userData = {
      id: uuidv4(), // ⇨ '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d'
      name,
      email,
      password,
      bills: JSON.stringify([]),
    };

    if (isUserExists(email)) {
      const client = await clientPromise;
      const db = client.db("booking");
      const collection = db.collection("users");

      const result = await collection.insertOne({
        name,
        email,
        password,
        createdAt: new Date(),
      });
      // const result = await client.hSet(`users:${userData.email}`, userData);
      console.log("result: ", result);
      return {
        message: {
          status: "success",
          data: {
            name,
            email,
          },
        },
      };
    } else {
      return { error: "User with email already exists!" };
    }
  } catch (e) {
    return { error: e };
  }
}

export async function fetchUser(email) {
  try {
    const result = await isUserExists(email);
    if (!result) {
      return { error: "No such user." };
    }
    return {
      message: { status: "success", data: result },
    };
  } catch (e) {
    return { error: e };
  }
}

export async function isUserExists(email) {
  let userExists = null;
  const client = await clientPromise;
  const db = client.db("booking");
  const collection = db.collection("users");

  const users = await collection.find({}).toArray();

  if (users.length > 0) {
    users.map((user) => {
      if (user.email == email) {
        userExists = {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          password: user.password,
        };
      }
    });
  }
  console.log("fetchUser: ", email, userExists);

  return userExists;
}

// Events

export async function fetchAllEvents(propertyId = "") {
  const client = await clientPromise;
  const db = client.db("booking");
  const collection = db.collection("events");

  const events = await collection.find({}).toArray();
  if (events.length > 0) {
    const allEvents = events.map((event) => {
      return {
        id: event._id.toString(),
        title: event.eventName,
        start: event.start,
        end: event.end,
        extendedProps: {
          numberOPeople: event.numberOfPeople,
          comments: event.comments,
          status: event.status,
        },
        description: "Test",
      };
    });

    return {
      message: {
        status: "success",
        data: [...allEvents],
      },
    };
  } else {
    return { error: "No Events Found!" };
  }
}

export async function fetchEvent(eventId, propertyId = "") {
  const client = await clientPromise;
  const db = client.db("booking");
  const collection = db.collection("events");
  if (eventId != "") {
    console.log("eventId: ", new Object(eventId));
    const event = await collection.findOne({ _id: new ObjectId(eventId) });
    console.log("event: ", event);
    if (event) {
      return {
        message: {
          status: "success",
          data: {
            id: event._id.toString(),
            title: event.eventName,
            start: event.start,
            end: event.end,
            extendedProps: {
              numberOPeople: event.numberOfPeople,
              comments: event.comments,
              status: event.status,
            },
            description: "Test",
          },
        },
      };
    }
    else {
      return { error: "No Events Found!" };
    }
  } else {
    return { error: "No Events Found!" };
  }
}

export async function createEvent(formData) {
  try {
    const { eventName, numberOfPeople, comments, startDate, endDate, status } =
      Object.fromEntries(formData);
    const eventData = {
      title: eventName,
      start: startDate,
      end: endDate,
      extendedProps: {
        numberOPeople: numberOfPeople,
        comments: comments,
        status: status,
      },
    };

    const client = await clientPromise;
    const db = client.db("booking");
    const collection = db.collection("events");

    const result = await collection.insertOne({
      eventName,
      numberOfPeople,
      comments,
      status: 0,
      start: startDate,
      end: endDate,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return {
      message: {
        status: "success",
        data: { id: result.insertedId.toString(), ...eventData },
      },
    };
  } catch (e) {
    return { error: e };
  }
}

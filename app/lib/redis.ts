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
        updatedAt: new Date(),
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

export async function fetchAllEvents(propertyId) {
  try {
    const client = await clientPromise;
    const db = client.db("booking");
    const collection = db.collection("events");

    const events = await collection.find({ propertyId }).toArray();
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
      return {
        message: {
          status: "success",
          data: [],
        },
      };
    }
  } catch (e) {
    return { error: e };
  }
}

export async function fetchEvent(eventId, propertyId = "") {
  const client = await clientPromise;
  const db = client.db("booking");
  const collection = db.collection("events");
  if (eventId != "") {
    const event = await collection.findOne({ _id: new ObjectId(eventId) });
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
    } else {
      return { error: "No Events Found!" };
    }
  } else {
    return { error: "No Events Found!" };
  }
}

export async function createEvent(formData) {
  try {
    const {
      propertyId,
      eventId,
      eventName,
      numberOfPeople,
      comments,
      startDate,
      endDate,
      status,
    } = Object.fromEntries(formData);
    const eventData = {
      id: eventId,
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

    if (eventId != "") {
      const result = await collection.updateOne(
        { _id: new ObjectId(eventId) },
        {
          $set: {
            eventName,
            numberOfPeople,
            comments,
            status,
            start: startDate,
            end: endDate,
            propertyId,
            updatedAt: new Date(),
          },
        }
      );

      return {
        message: {
          status: "success",
          data: eventData,
        },
      };
    } else {
      const result = await collection.insertOne({
        eventName,
        numberOfPeople,
        comments,
        status: 0,
        start: startDate,
        end: endDate,
        propertyId,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      return {
        message: {
          status: "success",
          data: { id: result.insertedId.toString(), ...eventData },
        },
      };
    }
  } catch (e) {
    return { error: e };
  }
}

export async function deleteEvent(eventId) {
  try {
    const client = await clientPromise;
    const db = client.db("booking");
    const collection = db.collection("events");

    if (eventId != "") {
      const result = await collection.deleteOne({ _id: new ObjectId(eventId) });

      return {
        message: {
          status: "success",
          data: { eventId, text: "Event Deleted Successfully." },
        },
      };
    } else {
      return {
        error: "No Event found;",
      };
    }
  } catch (e) {
    return { error: e };
  }
}

export async function approveEvent(event) {
  try {
    const client = await clientPromise;
    const db = client.db("booking");
    const collection = db.collection("events");

    if (event.id != "") {
      const test = event.extendedProps;
      const updatedEvent = {
        ...event,
        extendedProps: {
          ...test,
          status: 1,
        },
      };
      const result = await collection.updateOne(
        { _id: new ObjectId(event.id) },
        {
          $set: {
            ...event,
            status: 1,
            updatedAt: new Date(),
          },
        }
      );

      return {
        message: {
          status: "success",
          data: updatedEvent,
        },
      };
    } else {
      return {
        error: "No Event found;",
      };
    }
  } catch (e) {
    return { error: e };
  }
}

export async function rejectEvent(event) {
  try {
    const client = await clientPromise;
    const db = client.db("booking");
    const collection = db.collection("events");

    if (event.id != "") {
      const test = event.extendedProps;
      const updatedEvent = {
        ...event,
        extendedProps: {
          ...test,
          status: 2,
        },
      };
      const result = await collection.updateOne(
        { _id: new ObjectId(event.id) },
        {
          $set: {
            ...event,
            status: 2,
            updatedAt: new Date(),
          },
        }
      );

      return {
        message: {
          status: "success",
          data: updatedEvent,
        },
      };
    } else {
      return {
        error: "No Event found;",
      };
    }
  } catch (e) {
    return { error: e };
  }
}

export async function deleteAllEvents(propertyId) {
  try {
    const client = await clientPromise;
    const db = client.db("booking");
    const collection = db.collection("events");

    const events = await collection.deleteMany({ propertyId });

    return {
      message: {
        status: "success",
        data: "All Events Deleted.",
      },
    };
  } catch (e) {
    return { error: e };
  }
}

// Property

export async function fetchAllProperties(userId) {
  const client = await clientPromise;
  const db = client.db("booking");
  const collection = db.collection("properties");

  const properties = await collection.find({userId}).toArray();
  if (properties.length > 0) {
    const allProperties = properties.map((property) => {
      return {
        id: property._id.toString(),
        propertyName: property.propertyName,
        maxOccupancy: property.maxOccupancy,
        location: property.location,
        status: property.status,
        description: property.description,
      };
    });

    return {
      message: {
        status: "success",
        data: [...allProperties],
      },
    };
  } else {
    return { error: "No Properties Found!" };
  }
}

export async function fetchProperty(propertyId) {
  const client = await clientPromise;
  const db = client.db("booking");
  const collection = db.collection("properties");
  if (propertyId != "") {
    const property = await collection.findOne({ _id: new ObjectId(propertyId) });
    if (property) {
      return {
        message: {
          status: "success",
          data: {
            id: property._id.toString(),
            propertyName: property.propertyName,
            maxOccupancy: property.maxOccupancy,
            location: property.location,
            status: !property.status,
            description: property.description,
          },
        },
      };
    } else {
      return { error: "No Events Found!" };
    }
  } else {
    return { error: "No Events Found!" };
  }
}

export async function createProperty(formData) {
  try {
    const {
      userId,
      propertyId,
      propertyName,
      maxOccupancy,
      location,
      description,
      status,
    } = Object.fromEntries(formData);
    console.log('createProperty: ', formData);
    const propertyData = {
      id: propertyId,
      name: propertyName,
      maxOccupancy,
      location,
      status: status == 'off' ? false : true,
      description,
    };

    const client = await clientPromise;
    const db = client.db("booking");
    const collection = db.collection("properties");

    if (propertyId != "") {
      const result = await collection.updateOne(
        { _id: new ObjectId(propertyId) },
        {
          $set: {
            propertyName,
            maxOccupancy,
            description,
            location,
            status: status == 'off' ? false : true,
            userId,
            updatedAt: new Date(),
          },
        }
      );

      return {
        message: {
          status: "success",
          data: propertyData,
        },
      };
    } else {
      const result = await collection.insertOne({
        propertyName,
        maxOccupancy,
        description,
        location,
        status: status == 'off' ? false : true,
        userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      return {
        message: {
          status: "success",
          data: { id: result.insertedId.toString(), ...propertyData },
        },
      };
    }
  } catch (e) {
    return { error: e };
  }
}

export async function deleteProperty(propertyId) {
  try {
    const client = await clientPromise;
    const db = client.db("booking");
    const collection = db.collection("properties");

    if (propertyId != "") {
      const result = await collection.deleteOne({ _id: new ObjectId(propertyId) });
      await deleteAllEvents(propertyId);
      return {
        message: {
          status: "success",
          data: { propertyId, text: "Property Deleted Successfully." },
        },
      };
    } else {
      return {
        error: "No Property found;",
      };
    }
  } catch (e) {
    return { error: e };
  }
}
"use server";
import clientPromise from "@/lib/mongodb";
import { v4 as uuidv4 } from "uuid";

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

    if (fetchUser(email)) {
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
console.log('result: ', result);
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

// export async function fetchUser(email) {
//   try {
//     const result = await client.hGetAll(`users:${email}`);
//     if (!result || Object.keys(result).length === 0) {
//       return { error: "No such user." };
//     }
//     return { message: { status: "success", data: { ...result } } };
//   } catch (e) {
//     return { error: e };
//   }
// }

export async function fetchUser(email) {
  let userExists = null;
  const client = await clientPromise;
  const db = client.db("booking");
  const collection = db.collection("users");

  const users = await collection.find({}).toArray();

  if (users.length > 0) {
    users.map((user) => {
      if (user.email == email) {
        userExists = user;
      }
    });
  }
  console.log("fetchUser: ", email, userExists);

  return userExists;
}

// export async function fetchUserBills(email) {
//   try {
//     const result = await client.hGetAll(`users:${email}`);
//     if (!result || (Object.keys(result).length === 0 && result.bills)) {
//       return { error: "No such user." };
//     }
//     const bills = JSON.parse(result.bills);
//     return { message: { status: "success", data: { ...bills } } };
//   } catch (e) {
//     return { error: e };
//   }
// }

// export async function setUserBills(user, bills) {
//   try {
//     const result = await client.hSet(`users:${user.email}`, { bills, ...user });
//     return { message: { status: "success", data: { result } } };
//   } catch (e) {
//     return { error: e };
//   }
// }

// export async function moveDataToRedis(email, bills) {
//   try {
//     const user = await client.hGetAll(`users:${email}`);
//     const redisBills = JSON.parse(user.bills);
//     // const allBills = redisBills.concat(bills);
//     const mergedBills = [
//       ...redisBills,
//       ...bills.filter(
//         (localBill) =>
//           !redisBills.some((redisBill) => redisBill.id === localBill.id)
//       ),
//     ];
//     const currentUserData = {
//       ...user,
//       bills: JSON.stringify(mergedBills),
//     };
//     const result = await client.hSet(`users:${user.email}`, currentUserData);

//     return { message: { status: "success", data: mergedBills } };
//   } catch (e) {
//     return { error: e };
//   }
// }

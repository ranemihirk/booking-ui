"use server";
import clientPromise from "@/lib/mongodb";

export async function addRentData(formData: FormData) {
  const renterId = formData.get("renterId") as string;
  const rentMonth = formData.get("rentMonth") as string;
  const rentAmount = Number(formData.get("rentAmount"));
  const isRentPaid = formData.has("isRentPaid");

  try {
    const client = await clientPromise;
    const db = client.db("student-allocation");
    const collection = db.collection("rent-data");

    const result = await collection.insertOne({
      rentMonth,
      rentAmount,
      isRentPaid,
      renterId,
      createdAt: new Date(),
    });
    return { success: true, message: "Renter added successfully!" };
  } catch (error) {
    console.error("Error inserting Renter:", error);
    return { success: false, message: "Failed to add Renter." };
  }
}

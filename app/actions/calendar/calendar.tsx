import {
  EventFormSchema,
  EventFormState,
} from "@/lib/definations";

export async function createevent(state: EventFormState, formData: FormData) {
  // Validate form fields
  const validatedFields = EventFormSchema.safeParse({
    eventName: formData.get("event-name"),
    numberOfPeople: formData.get("number-of-people"),
  });

  // If any form fields are invalid, return early
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  // Call the provider or db to create a user...
}

// export async function editevent(state: SigninFormState, formData: FormData) {
//   // Validate form fields
//   const validatedFields = SigninFormSchema.safeParse({
//     email: formData.get("email"),
//     password: formData.get("password"),
//   });

//   // If any form fields are invalid, return early
//   if (!validatedFields.success) {
//     return {
//       errors: validatedFields.error.flatten().fieldErrors,
//     };
//   }

//   // Call the provider or db to create a user...
// }
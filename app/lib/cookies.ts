// Function to set a cookie by name
export function setCookie(email) {
  // Set a cookie with a timestamp (current time in seconds)
  const timestamp = Date.now(); // Get the current time in milliseconds
  const expirationTime = 60 * 60 * 24 * 15; // 15 days expiration (for example)

  document.cookie = `MyBooking=${email}; timestamp=${timestamp}; path=/; max-age=${expirationTime}`;

  // Check if the cookie is less than 15 days old
  const isCookieValid = checkCookieAge("MyBooking");
  console.log("Is cookie less than 15 days old?", isCookieValid);
}

// Function to get a cookie by name
export function getCookie(name) {
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? match[2] : null;
}

// Function to check if cookie is less than 'days' old
export function checkCookieAge(cookieName) {
  const cookieValue = getCookie(cookieName);
  const timestamp = getCookie(`${cookieName}_timestamp`);

  if (!cookieValue || !timestamp) {
    return false; // Cookie doesn't exist or timestamp is missing
  }

  const currentTime = Date.now();
  const cookieAge = currentTime - parseInt(timestamp);

  // Check if cookie is less than the specified number of days old
  return cookieAge <= 15 * 24 * 60 * 60 * 1000; // Convert days to milliseconds
}

export function removeCookie() {
  // Remove a cookie
  document.cookie = "MyBooking=; path=/; max-age=0;";
}

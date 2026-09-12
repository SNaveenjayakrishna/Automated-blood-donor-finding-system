/*// services/api.js
export const fetchUser = async () => {
  const res = await fetch("http://localhost:5000/dashboard", {
    method: "GET",
    credentials: "include",
  });
  return res.json();
};

export const logoutUser = async () => {
  await fetch("http://localhost:5000/logout", {
    method: "POST",
    credentials: "include",
  });
};

export const updateUser = async (userId, body) => {
  const res = await fetch(`http://localhost:5000/update_user/${userId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return res.json();
};

export const deleteUser = async (userId) => {
  const res = await fetch(`http://localhost:5000/delete_user/${userId}`, {
    method: "DELETE",
  });
  return res.json();
};

export const toggleAvailability = async (userId, availability) => {
  const res = await fetch("http://localhost:5000/availability", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ user_id: userId, availability }),
  });
  return res.json();
};

export const updateLastDonation = async (userId, lastDonationDate) => {
  const res = await fetch("http://localhost:5000/lastdonation", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ user_id: userId, last_donation_date: lastDonationDate }),
  });
  return res.json();
};

export const fetchMyDonations = async (userId) => {
  const res = await fetch(`http://localhost:5000/mydonations?user_id=${userId}`, {
    method: "GET",
    credentials: "include",
  });
  return res.json();
};

export const fetchRequests = async () => {
  const res = await fetch("http://localhost:5000/requests", {
    method: "GET",
    credentials: "include",
  });
  return res.json();
};
*/ 
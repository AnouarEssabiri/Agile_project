export const getCurrentUser = () => {
  if (typeof window !== "undefined") {
    const user = localStorage.getItem("currentUser")
    return user ? JSON.parse(user) : null
  }
  return null
}

export const setCurrentUser = (user) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("currentUser", JSON.stringify(user))
  }
}

export const logout = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("currentUser")
  }
}

export const isAdmin = () => {
  const user = getCurrentUser()
  return user?.role === "Admin"
}

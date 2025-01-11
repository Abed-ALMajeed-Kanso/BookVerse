let users = [
    { username: "john_doe", password: "password123" },
    { username: "jane_smith", password: "securePass456" },
    { username: "booklover", password: "readBooks789" }
  ];
  
const isValid = (username)=>{
  let matchingUsernames = users.filter(user => user.username === username)
  if (matchingUsernames.length > 0) return true
  return false
}

const authenticatedUser = (username,password)=>{ 
  let validUsers = users.filter((user)=>(user.username === username && user.password === password))
  if(validUsers.length > 0) return true
  return false;
}
  
module.exports = {
    users,
    isValid,
    authenticatedUser
};
  
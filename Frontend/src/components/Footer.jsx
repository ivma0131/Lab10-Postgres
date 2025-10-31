import React from 'react'

// make a variable that gets the current year and use it in the footer
const currentYear = new Date().getFullYear();

const Footer = () => {
  return (
    <footer>
      <p>&copy; {currentYear} Ivan's Puppy App. All rights reserved.</p>
    </footer>
  )
}

export default Footer
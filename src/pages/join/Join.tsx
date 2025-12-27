import React from 'react'
import { useNavigate } from 'react-router-dom';

const Join = () => {
    const navigate = useNavigate();
  return (
    <div>
      join Page
      <button   onClick={() => navigate("/")}>Back</button>
    </div>
  )
}

export default Join

import { useState, useEffect } from "react"
import { useAddNewNoteMutation } from "../notes/notesApiSlice"
import { useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSave } from "@fortawesome/free-solid-svg-icons"
import { ROLES } from "../../config/roles"
import { useAddNewUserMutation } from "./usersApiSlice"

const USER_REGEX = /^[A-z]{3,20}$/
const PWD_REGEX = /^[A-z0-9!@#$%]{4,12}$/

const NewUserForm = () => {

    const [addNewUser, {
        isLoading,
        isSuccess,
        isError,
        error
    }] = useAddNewUserMutation()

    const navigate = useNavigate()

    const [username, setUsername] = userState('')
    const [validUsername, setValidUsername] = useState(false)

    return (
        <div>NewUserForm</div>
    )
}

export default NewUserForm
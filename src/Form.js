import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Form() {

    const [username, setUsername] = useState("");
    const [mobile, setMobile] = useState("");
    const [email, setEmail] = useState("");
    const [address, setAddress] = useState("");
    const [users, setUsers] = useState([]);
    const url = process.env.NODE_ENV === 'production' ? '' : 'http:localhost:3001';

    useEffect(() => {
        axios.get(url + '/form')
            .then((response) => {
                if(response.data.recordset.length > 0){
                    document.getElementById('userData').style.display = 'table';
                    setUsers(response.data.recordset);
                }
            });
    },[])

    const submit = (e) => {
        if (checkForm()) {
            e.preventDefault();
            document.querySelectorAll('input').forEach((input) => (input.value = ''));
            axios.post(url + '/users', {
                username: username,
                mobile: mobile,
                email: email,
                address: address
            }).then((response) => {
                alert("User added successfully!");
                axios.get(url + '/form')
                .then((response) => {
                    if(response.data.recordset.length > 0) {
                        document.getElementById('userData').style.display = 'table';
                        setUsers(response.data.recordset);
                    }
                });
            }); 
        }
    };

    const deleteUser = (id) => {
        axios.delete(url + `/delete?id=${id}`)
            .then((response) => {
                alert('User deleted successfully!');
                axios.get(url + '/form')
                    .then((response) => {
                        if (response.data.recordset.length > 0) {
                            document.getElementById('userData').style.display = 'table';
                            setUsers(response.data.recordset);
                        } else {
                            document.getElementById('userData').style.display = 'none';
                        }
                    });
            });
    };

    function checkForm() {
        const username = document.getElementById('usernameId');
        const mobile = document.getElementById('mobileId');
        const email = document.getElementById('emailId');
        const address = document.getElementById('addressId');

        if (username.value === "") {
            alert("Error: Please enter Username!");
            username.focus();
            return false;
        }
        if (mobile.value === "") {
            alert("Error: Please enter Mobile number!");
            mobile.focus();
            return false;
        }
        if (email.value === "") {
            alert("Error: Please enter Email id!");
            email.focus();
            return false;
        }
        if (address.value === "") {
            alert("Error: Please enter Address!");
            address.focus();
            return false;
        }

        if (!(/^[\w]+$/).test(username.value)) {
            alert("Error: Username contains invalid characters!");
            username.focus();
            return false;
        }

        if(!(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i).test(email.value)) {
            alert("Error: Email id contains invalid characters!");
            email.focus();
            return false;
        }

        if(!(/^([+]\d{2})?\d{10}$/).test(mobile.value)) {
            alert("Error: Invalid Mobile no.!");
            mobile.focus();
            return false;
        }

        return true;
    }

    return (
        <div className="form">
            <div className="tab1">
                <form id="myForm">
                    <div>
                        <label className="required">Username</label><br />
                        <input id="usernameId" type="text" name="username" placeholder="Enter your username" required onChange={(e) => { setUsername(e.target.value) }} /><br />
                    </div>
                    <div>
                        <label className="required">Mobile Number</label><br />
                        <input id="mobileId" type="text" name="mobile" placeholder="Enter your mobile no." pattern="[1-9]{1}[0-9]{9}" maxLength="10" required onChange={(e) => { setMobile(e.target.value) }} /><br />
                    </div>
                    <div>
                        <label className="required">Email Id</label><br />
                        <input id="emailId" type="email" name="email" placeholder="Enter your email id" required onChange={(e) => { setEmail(e.target.value) }} /><br />
                    </div>
                    <div>
                        <label className="required">Address</label><br />
                        <input id="addressId" type="text" name="address" placeholder="Enter your address" required onChange={(e) => { setAddress(e.target.value) }} /><br />
                    </div>
                    <button id="submitBtn" onClick={submit}>SUBMIT</button>
                </form>
            </div>
            <div id="userData">
                <div className="tab2">
                    <table>
                        <thead>
                            <tr>
                                <th>Username</th>
                                <th>Mobile no.</th>
                                <th>Email</th>
                                <th>Address</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => {
                                return <tr key={user.id}>
                                    <td>{user.username}</td>
                                    <td>{user.mobile}</td>
                                    <td>{user.email}</td>
                                    <td>{user.address}</td>
                                    <td><button id="deleteBtn" onClick={() => deleteUser(user.id)}>DELETE</button></td>
                                </tr>
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default Form;

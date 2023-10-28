// App.js
import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.css";
import "react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css";
import axios from "axios";

import EditUserDetails from "./EditUserDetails";
import SearchBar from "./SearchBar";
import UsersTable from "./UsersTable";

function App() {
  const [users, setUsers] = useState([]);
  const [searchedUsers, setSearchedUsers] = useState([]);
  const [rowInfoToEdit, setRowInfoToEdit] = useState({});
  const [shouldShowEditUserModal, toggleModalVisibility] = useState(false);
  const [searchedText, onSearchTextChange] = useState("");
  const [selectedUserIds, selectUserIds] = useState([]);

  useEffect(() => {
    axios({
      method: "GET",
      baseURL:
        "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json"
    }).then((res) => {
      const userData = res.data;
      setUsers(userData);
      setSearchedUsers(userData);
    });
  }, []);

  const handleDelete = (rowId, name) => {
    console.log("searched users are ", searchedUsers);
    const filteredData = searchedUsers.filter((user) => user.id !== rowId);
    setSearchedUsers(filteredData);
  };

  const handleDeleteSelected = () => {
    const selectedUsersSet = new Set(selectedUserIds);
    const filteredData = searchedUsers.filter(
      (user) => !selectedUsersSet.has(user.id)
    );
    setSearchedUsers(filteredData);
  };

  const handleEditUserDetails = (rowInfo) => {
    setRowInfoToEdit(rowInfo);
    toggleModalVisibility(true);
  };

  const onModalSubmit = (newCustomerDetails) => {
    const { id } = newCustomerDetails;
    const newSearchedUsers = searchedUsers.map((user) => {
      if (user.id === id) {
        return { ...user, ...newCustomerDetails };
      }
      return user;
    });
    const newUsers = users.map((user) => {
      if (user.id === id) {
        return { ...user, ...newCustomerDetails };
      }
      return user;
    });
    console.log("new searched data ", newSearchedUsers);
    setUsers(newUsers);
    setSearchedUsers(newSearchedUsers);
  };

  const handleSearch = (value) => {
    console.log("value and searchedText are ", value, searchedText);
    const valueToSearch = value ?? searchedText;
    const filteredData = users.filter(
      (item) =>
        item.name.toLowerCase().includes(valueToSearch.toLowerCase()) ||
        item.role.toLowerCase().includes(valueToSearch.toLowerCase()) ||
        item.email.toLowerCase().includes(valueToSearch.toLowerCase())
    );
    setSearchedUsers(filteredData);
  };

  return (
    <div className="App">
      <h5>Admin UI Challenge</h5>
      <SearchBar
        onSearchTextChange={onSearchTextChange}
        handleSearch={handleSearch}
      />
      <UsersTable
        currentUsers={searchedUsers}
        selectUserIds={selectUserIds}
        selectedUserIds={selectedUserIds}
        handleEditUserDetails={handleEditUserDetails}
        handleDelete={handleDelete}
      />
      <button className="btn btn-danger btn-xl" onClick={handleDeleteSelected}>
        Delete Selected
      </button>
      {/* EditUserDetails is a Modal to edit user details */}
      <EditUserDetails
        shouldShowEditUserModal={shouldShowEditUserModal}
        toggleModalVisibility={toggleModalVisibility}
        customerDetails={rowInfoToEdit}
        onModalSubmit={onModalSubmit}
      />
    </div>
  );
}

export default App;

import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import "./UserManage.scss"
import { getAllUserService, createNewUserService, deleteUserService, editUserService } from "../../services/userService"
import ModalUser from "./ModalUser"
import ModalEditUser from "./ModalEditUser"
import { emitter } from '../../utils/emitter'

class UserManage extends Component {

    constructor(props) {
        super(props)
        this.state = {
            arrUser: [],
            isOpenModalUser: false,
            isOpenModalEditUser: false,
            userEdit: {}
        }
    }

    async componentDidMount() {
        await this.getAllUser()

    }

    getAllUser = async () => {
        let response = await getAllUserService('all')
        if (response && response.errCode === 0) {
            this.setState({
                arrUser: response.users
            })
        }
    }

    toggleUserModal = () => {
        this.setState({
            isOpenModalUser: !this.state.isOpenModalUser
        })
    }

    createNewUser = async (data) => {
        try {
            let response = await createNewUserService(data)
            if (response && response.errCode === 0) {
                await this.getAllUser()
                this.toggleUserModal()

                emitter.emit('EVENT_CLEAR_DATA_MODAL')
            }
            else {
                alert(response.message)
            }

        }
        catch (error) {
            console.log(error)
        }

    }

    handleDeleteUser = async (user) => {
        try {
            let response = await deleteUserService(user.id)
            if (response && response.errCode === 0) {
                await this.getAllUser()
            }
            else {
                alert(response.message)
            }

        } catch (error) {
            console.log(error)
        }
    }

    handleEditUser = (user) => {
        this.toggleEditUserModal()
        this.setState({
            userEdit: user
        })

    }

    toggleEditUserModal = () => {
        this.setState({
            isOpenModalEditUser: !this.state.isOpenModalEditUser
        })
    }

    callEditUser = async (data) => {
        try {
            let response = await editUserService(data)
            if (response && response.errCode === 0) {
                await this.getAllUser()
                this.toggleEditUserModal()

                // emitter.emit('EVENT_CLEAR_DATA_MODAL')
            }
            else {
                alert(response.message)
            }
        }
        catch (error) {
            console.log(error)
        }

    }


    render() {
        let { arrUser } = this.state
        return (
            <div className='user-container'>
                <ModalUser
                    isOpenModalUser={this.state.isOpenModalUser}
                    toggleUserModal={this.toggleUserModal}
                    createNewUser={this.createNewUser}
                />
                {this.state.isOpenModalEditUser == true && <ModalEditUser
                    handleEditUser={this.handleEditUser}
                    isOpenModalEditUser={this.state.isOpenModalEditUser}
                    userEdit={this.state.userEdit}
                    callEditUser={this.callEditUser}
                />}
                <div className="text-center title">Manage users</div>
                <button onClick={this.toggleUserModal} className='add-new-user'> <i className="fas fa-plus"></i> Add New User</button>

                <div className=' user-table mt-3 mx-1'>
                    <table id="customers" >
                        <thead>
                            <tr>
                                <th >email</th>
                                <th>First Name</th>
                                <th>Last Name</th>
                                <th>Address</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {arrUser && arrUser.map((item, index) => {
                                return (
                                    <tr key={item.id}>
                                        <td> {item.email} </td>
                                        <td> {item.firstName} </td>
                                        <td> {item.lastName} </td>
                                        <td> {item.address} </td>
                                        <td style={{ width: '130px' }} >
                                            <i onClick={() => this.handleEditUser(item)} className="fas fa-pencil-alt btn-action"></i>
                                            <i onClick={() => { this.handleDeleteUser(item) }} className="fas fa-trash btn-action"></i>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserManage);

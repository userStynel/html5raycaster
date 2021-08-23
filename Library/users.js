function AddUser(socket, userInfo){
    user_list[socket.id] = userInfo;
    inc = inc+1;
    //console.log(user_list);
}

function DeleteUser(socket){
    delete user_list[socket];
}

exports.AddUser = AddUser;
exports.DeleteUser = DeleteUser;
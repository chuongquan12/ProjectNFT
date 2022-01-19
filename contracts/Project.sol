pragma solidity >=0.7.0 <0.9.0;

contract Project {
    event send_data(address _address, string _id);

    Avatar[] public arrAvatar;
    struct Avatar {
        string _id;
        address _address;
    }

    function createAvatar(string memory _id) public {
        Avatar memory newAvatar = Avatar(_id, msg.sender);

        arrAvatar.push(newAvatar);
        emit send_data(msg.sender, _id);
    }

}
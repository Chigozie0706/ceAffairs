// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;
import "@openzeppelin/contracts/utils/Strings.sol";

contract DecFriendz{

    uint internal eventLength = 0;
    uint internal eventCommentsLength = 0; 

    // Ceating a struct to store voucher details.
    struct Event {
        address  owner;
        string eventName;
        string eventDetails;
        uint datePosted;
        string eventCard;
    }


    struct EventComment {
        uint eventId;
        string comment;
        address owner;
    }

    struct EventComment1 {
        uint eventId;
        string comment;
        address owner;
    }

    


   
    
    mapping (uint => Event) internal events;
    mapping (uint => EventComment) internal eventComments;
    mapping (uint => EventComment1[]) internal eventComments1;
    mapping(uint256 => string[]) internal reviews;
    mapping(uint256 => address[]) internal eventAttendees;


    function addEventComment(uint256 _index, string memory _comment) public
    {
        eventComments1[_index].push(EventComment1({owner : msg.sender, comment: _comment,   eventId : _index}));
    }

    function getEventComment(uint256 _index)
        public
        view
        returns (EventComment1[] memory)
    {
        return eventComments1[_index];
    }
    
    
    
    // Function to create  a voucher.
    function createEvent(string memory _eventName, string memory _eventDetails, string 
    memory _eventCard) public {
        events[eventLength] = Event({owner : msg.sender, eventName: _eventName, 
     eventDetails: _eventDetails, datePosted: block.timestamp, eventCard : _eventCard});
     eventLength++;
}


  function commentOnEvent (string memory _comment,  uint _eventId) public {
   eventComments[eventCommentsLength] =  EventComment({eventId : _eventId, 
    comment: _comment, owner : msg.sender});
    eventCommentsLength++;
}


function deleteEventById(uint _index) public {
        require(msg.sender == events[_index].owner, "you are not the owner");
        delete events[_index];
    }


    // Function to get the records of all vouchers created.
    function getEventById(uint _index) public view returns (
        address,
        string memory, 
        string memory, 
        uint,
        string memory
    ) {
    
        return (
            events[_index].owner,
            events[_index].eventName, 
            events[_index].eventDetails,
            events[_index].datePosted,
            events[_index].eventCard
        );
    }


    function addReview(uint256 _index, string memory _review) public
    {
        reviews[_index].push(_review);
    }

    function addEventAttendees(uint256 _index) public
    {
        eventAttendees[_index].push(msg.sender);
    
    }

    function getAttendees(uint256 _index)
        public
        view
        returns (address[] memory)
    {
        return eventAttendees[_index];
    }

    function getReview(uint256 _index)
        public
        view
        returns (string[] memory)
    {
        return reviews[_index];
    }
    
    
    // Function to get current TimeStamp.
    function getCurrentTimeStamp () private view returns(uint) {
        return block.timestamp;
    }


//     function deleteEventById (uint _index) public {
//         require(msg.sender == events[_index].owner, "Invalid owner");
//         delete events[_index];
// }

// function deleteEventById(uint256 _index) public {
//         require(msg.sender == events[_index].owner, "Invalid owner");
//         events[_index].isDeleted = "true";
//     }    

function getEventLength() public view returns (uint) {
        return (eventLength);
    }    

}
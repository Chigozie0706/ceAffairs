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
        string eventCardImgUrl;
        string eventDetails;
        string eventDate;
        string eventTime;
        string eventLocation;
        
    }

    
   
    
    mapping (uint => Event) internal events;
    mapping(uint256 => address[]) internal eventAttendees;


    // Function to create  a voucher.
    function createEvent(string memory _eventName, string memory _eventCardImgUrl,
    string memory _eventDetails, string memory _eventDate, 
    string memory _eventTime, string memory _eventLocation) public {
        events[eventLength] = Event({owner : msg.sender, eventName: _eventName, eventCardImgUrl : _eventCardImgUrl, 
     eventDetails: _eventDetails, eventDate : _eventDate, 
     eventTime : _eventTime, eventLocation : _eventLocation});
     eventLength++;
}


// Function to get the records of all vouchers created.
    function getEventById(uint _index) public view returns (
        address,
        string memory,
        string memory,
        string memory,
        string memory,
        string memory,
        string memory
        
    ) {
    
        return (
            events[_index].owner,
            events[_index].eventName, 
            events[_index].eventCardImgUrl,
            events[_index].eventDetails,
            events[_index].eventDate,
            events[_index].eventTime,
            events[_index].eventLocation
        );
    }

function deleteEventById(uint _index) public {
        require(msg.sender == events[_index].owner, "you are not the owner");
        delete events[_index];
    }


    function addEventAttendees(uint256 _index) public {
        eventAttendees[_index].push(msg.sender);
    
    }

    function getAttendees(uint256 _index) public view returns (address[] memory) {
        return eventAttendees[_index];
    }

    function getEventLength() public view returns (uint) {
        return (eventLength);
    }    

}


// struct EventComment {
    //     uint eventId;
    //     string comment;
    //     address owner;
    // }

    // struct EventComment1 {
    //     uint eventId;
    //     string comment;
    //     address owner;
    // }

    // mapping (uint => EventComment) internal eventComments;
    // mapping (uint => EventComment1[]) internal eventComments1;
    // mapping(uint256 => string[]) internal reviews;
    



    // function addEventComment(uint256 _index, string memory _comment) public
    // {
    //     eventComments1[_index].push(EventComment1({owner : msg.sender, comment: _comment,   eventId : _index}));
    // }

    // function getEventComment(uint256 _index)
    //     public
    //     view
    //     returns (EventComment1[] memory)
    // {
    //     return eventComments1[_index];
    // }
    
    
    



//   function commentOnEvent (string memory _comment,  uint _eventId) public {
//    eventComments[eventCommentsLength] =  EventComment({eventId : _eventId, 
//     comment: _comment, owner : msg.sender});
//     eventCommentsLength++;
// }




    

    // function addReview(uint256 _index, string memory _review) public
    // {
    //     reviews[_index].push(_review);
    // }

    
    // function getReview(uint256 _index)
    //     public
    //     view
    //     returns (string[] memory)
    // {
    //     return reviews[_index];
    // }
    
    
    // Function to get current TimeStamp.
    // function getCurrentTimeStamp () private view returns(uint) {
    //     return block.timestamp;
    // }


//     function deleteEventById (uint _index) public {
//         require(msg.sender == events[_index].owner, "Invalid owner");
//         delete events[_index];
// }

// function deleteEventById(uint256 _index) public {
//         require(msg.sender == events[_index].owner, "Invalid owner");
//         events[_index].isDeleted = "true";
//     }    

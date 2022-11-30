// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;
import "@openzeppelin/contracts/utils/Strings.sol";

contract CeAffairs{
// Declaring variables.
    uint internal eventLength = 0;
    uint internal eventCommentsLength = 0; 

    // Ceating a struct to store event details.
    struct Event {
        address  owner;
        string eventName;
        string eventCardImgUrl;
        string eventDetails;
        string eventDate;
        string eventTime;
        string eventLocation;
        
    }

    //map for storing events.
    mapping (uint => Event) internal events;

    //map for storing list of attendees
    mapping(uint256 => address[]) internal eventAttendees;


    // Function to create  an event.
    function createEvent(string memory _eventName, string memory _eventCardImgUrl,
    string memory _eventDetails, string memory _eventDate, 
    string memory _eventTime, string memory _eventLocation) public {
        events[eventLength] = Event({owner : msg.sender, eventName: _eventName, eventCardImgUrl : _eventCardImgUrl, 
     eventDetails: _eventDetails, eventDate : _eventDate, 
     eventTime : _eventTime, eventLocation : _eventLocation});
     eventLength++;
}


// Function to get a event through its id.
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

//Function only a event owner can delete an event. 
function deleteEventById(uint _index) public {
        require(msg.sender == events[_index].owner, "you are not the owner");
        delete events[_index];
    }

//Function to attend an event.
    function addEventAttendees(uint256 _index) public {
        eventAttendees[_index].push(msg.sender);
    
    }

//function to get list of event attendees by event id.
    function getAttendees(uint256 _index) public view returns (address[] memory) {
        return eventAttendees[_index];
    }


//function to get length of event.
    function getEventLength() public view returns (uint) {
        return (eventLength);
    }    

}

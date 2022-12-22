pragma solidity ^0.8.3;
import "@openzeppelin/contracts/utils/Strings.sol";

contract CeAffairs {
    // Declaring variables.
    uint internal eventLength = 0;
    uint internal eventCommentsLength = 0; 

    // Ceating a struct to store event details.
    struct Event {
        address  owner;
        string eventName;
        string eventCardImgUrl;
        string eventDetails;
        uint   eventDate;
        string eventTime;
        string eventLocation;
    }

    // map for storing events.
    mapping (uint => Event) internal events;

    // map for storing list of attendees.
    mapping(uint256 => address[]) internal eventAttendees;

    // map for attendance check.
    mapping(uint => mapping(address => bool)) public attendanceCheck;

    // Enum for event status.
    enum EventStatus {
        Active,
        Deleted,
    }

    // map for storing event status.
    mapping(uint => EventStatus) internal eventStatus;

    // Function to create an event.
    function createEvent(
        string memory _eventName,
        string memory _eventCardImgUrl,
        string memory _eventDetails,
        uint  _eventDate, 
        string memory _eventTime,
        string memory _eventLocation
    ) public {
        // Check if the event date is in the future.
        require(_eventDate > block.timestamp, "event date must be in the future");
        // Check if the event time is valid.
        require(Strings.isAlphaNumeric(_eventTime), "event time must be alphanumeric");
        // Check if the event location is a valid address.
        require(Strings.isAddress(_eventLocation), "event location must be a valid address");

        events[eventLength] = Event({
            owner : msg.sender,
            eventName: _eventName,
            eventCardImgUrl : _eventCardImgUrl, 
            eventDetails: _eventDetails,
            eventDate : _eventDate, 
            eventTime : _eventTime,
            eventLocation : _eventLocation
        });
        eventLength++;
        eventStatus[eventLength] = EventStatus.Active;
    }

    // Function to get an event by its id.
    function getEventById(uint _index) public view returns (
        address,
        string memory,
        string memory,
        string memory,
        uint,
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

    // Function only an event owner can delete an event. 
    function deleteEventById(uint _index) public {
        // Check if the event exists.
        require(_index < eventLength, "event does not exist");
        // Check if the caller is the event owner.
        require(msg.sender == events[_index].owner, "you are

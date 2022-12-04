// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

contract CeAffairs {
    // Declaring variables.
    uint256 internal eventLength = 0;
    uint256 internal eventCommentsLength = 0;

    // Ceating a struct to store event details.
    struct Event {
        address owner;
        string eventName;
        string eventCardImgUrl;
        string eventDetails;
        uint eventDate;
        uint eventTime;
        string eventLocation;
    }

    //map for storing events.
    mapping(uint256 => Event) internal events;

    //map for storing list of attendees
    mapping(uint256 => address[]) internal eventAttendees;

    mapping(uint => mapping(address => bool)) public attending;

    // Function to create  an event.
    function createEvent(
        string calldata _eventName,
        string calldata _eventCardImgUrl,
        string calldata _eventDetails,
        uint256 _eventDate,
        uint _eventTime,
        string calldata _eventLocation
    ) public {
        require(bytes(_eventName).length > 0);
        require(bytes(_eventCardImgUrl).length > 0);
        require(bytes(_eventDetails).length > 0);
        require(bytes(_eventLocation).length > 0);
        require(_eventDate > block.timestamp);
        require(_eventTime > 0 && _eventTime < 1 days);
        events[eventLength] = Event({
            owner: msg.sender,
            eventName: _eventName,
            eventCardImgUrl: _eventCardImgUrl,
            eventDetails: _eventDetails,
            eventDate: _eventDate,
            eventTime: _eventTime,
            eventLocation: _eventLocation
        });
        eventLength++;
    }

    // Function to get a event through its id.
    function getEventById(uint256 _index)
        public
        view
        returns (
            address,
            string memory,
            string memory,
            string memory,
            uint,
            uint,
            string memory
        )
    {
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
    function deleteEventById(uint256 _index) public {
        require(msg.sender == events[_index].owner, "you are not the owner");
        delete events[_index];
    }

    //Function to attend an event.
    function addEventAttendees(uint256 _index) public {
        require(!attending[_index][msg.sender], "you have already added event");
        require(events[_index].eventDate > block.timestamp);
        attending[_index][msg.sender] = true;
        eventAttendees[_index].push(msg.sender);
    }

    //function to get list of event attendees by event id.
    function getAttendees(uint256 _index)
        public
        view
        returns (address[] memory)
    {
        return eventAttendees[_index];
    }

    //function to get length of event.
    function getEventLength() public view returns (uint256) {
        return (eventLength);
    }
}

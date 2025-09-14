// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract SupplyChain {
    struct Event {
        uint256 id;
        string productId;
        string stage;
        string actorId;
        uint256 timestamp;
        string[] evidenceHashes;
        bool verified;
    }
    
    mapping(string => Event[]) private productEvents;
    mapping(uint256 => Event) private events;
    uint256 private eventCounter;
    
    address public owner;
    
    event EventAdded(
        uint256 indexed eventId,
        string indexed productId,
        string stage,
        string actorId,
        uint256 timestamp
    );
    
    event EventVerified(uint256 indexed eventId, bool verified);
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }
    
    constructor() {
        owner = msg.sender;
        eventCounter = 0;
    }
    
    function addEvent(
        string memory productId,
        string memory stage,
        string memory actorId,
        uint256 timestamp,
        string[] memory evidenceHashes
    ) public returns (uint256) {
        eventCounter++;
        
        Event memory newEvent = Event({
            id: eventCounter,
            productId: productId,
            stage: stage,
            actorId: actorId,
            timestamp: timestamp,
            evidenceHashes: evidenceHashes,
            verified: false
        });
        
        productEvents[productId].push(newEvent);
        events[eventCounter] = newEvent;
        
        emit EventAdded(eventCounter, productId, stage, actorId, timestamp);
        
        return eventCounter;
    }
    
    function getProductEvents(string memory productId) 
        public 
        view 
        returns (Event[] memory) 
    {
        return productEvents[productId];
    }
    
    function getEvent(uint256 eventId) 
        public 
        view 
        returns (Event memory) 
    {
        return events[eventId];
    }
    
    function verifyEvent(uint256 eventId, bool verified) 
        public 
        onlyOwner 
    {
        events[eventId].verified = verified;
        
        // Update in product events array
        string memory productId = events[eventId].productId;
        Event[] storage prodEvents = productEvents[productId];
        
        for (uint i = 0; i < prodEvents.length; i++) {
            if (prodEvents[i].id == eventId) {
                prodEvents[i].verified = verified;
                break;
            }
        }
        
        emit EventVerified(eventId, verified);
    }
    
    function getEventCount() public view returns (uint256) {
        return eventCounter;
    }
    
    function transferOwnership(address newOwner) public onlyOwner {
        require(newOwner != address(0), "New owner cannot be zero address");
        owner = newOwner;
    }
}

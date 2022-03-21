// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21 <0.9.0;

//Importing openzeppelin-solidity ERC-721 implemented Standard
import "../node_modules/openzeppelin-solidity/contracts/token/ERC721/ERC721.sol";

// StarNotary Contract declaration inheritance the ERC721 openzeppelin implementation
contract StarNotary is ERC721 {

    // Star data
    struct Star {
        string name;
    }

    // Implement Task 1 Add a name and symbol properties
    // name: Is a short name to your token
    // symbol: Is a short string like 'USD' -> 'American Dollar'
    string public name_ = "StarNotaryToken";
    string public symbol_ = "SNT";

    constructor() public ERC721(name_,symbol_){

    }
    

    // mapping the Star with the Owner Address
    mapping(uint256 => Star) public tokenIdToStarInfo;
    // mapping the TokenId and price
    mapping(uint256 => uint256) public starsForSale;

    
    // Create Star using the Struct
    function createStar(string memory _name, uint256 _tokenId) public { // Passing the name and tokenId as a parameters
        Star memory newStar = Star(_name); // Star is an struct so we are creating a new Star
        tokenIdToStarInfo[_tokenId] = newStar; // Creating in memory the Star -> tokenId mapping
        _mint(msg.sender, _tokenId); // _mint assign the the star with _tokenId to the sender address (ownership)
    }

    // Putting an Star for sale (Adding the star tokenid into the mapping starsForSale, first verify that the sender is the owner)
    function putStarUpForSale(uint256 _tokenId, uint256 _price) public {
        require(ownerOf(_tokenId) == msg.sender, "You can't sale the Star you don't owned");
        starsForSale[_tokenId] = _price;
    }


    // Function that allows you to convert an address into a payable address
    function _make_payable(address x) internal pure returns (address payable) {
        return payable(x);
    }

    function buyStar(uint256 _tokenId) public  payable {
        require(starsForSale[_tokenId] > 0, "The Star should be up for sale");
        uint256 starCost = starsForSale[_tokenId];
        address ownerAddress = ownerOf(_tokenId);
        require(msg.value > starCost, "You need to have enough Ether");
        transferFrom(ownerAddress, msg.sender, _tokenId); // We can't use _addTokenTo or_removeTokenFrom functions, now we have to use _transferFrom
        address payable ownerAddressPayable = _make_payable(ownerAddress); // We need to make this conversion to be able to use transfer() function to transfer ethers
        ownerAddressPayable.transfer(starCost);
        if(msg.value > starCost) {
            _make_payable(msg.sender).transfer(msg.value - starCost);
        }
    }

    // Implement Task 1 lookUptokenIdToStarInfo
    function lookUptokenIdToStarInfo (uint _tokenId) public view returns (string memory) {
        //1. You should return the Star saved in tokenIdToStarInfo mapping 
        Star memory targetToken = tokenIdToStarInfo[_tokenId];
        return targetToken.name;
    }

    // Implement Task 1 Exchange Stars function
    function exchangeStars(uint256 _tokenId1, uint256 _tokenId2) public {

        //Assuming all tokens exist

        address ownerOfToken1 = ownerOf(_tokenId1);
        address ownerOfToken2 = ownerOf(_tokenId2);

        // check if the owner of _tokenId1 or _tokenId2 is the sender
        if(msg.sender == ownerOfToken1){

            //Take from msg.sender and give to owner of second token
            transferFrom(msg.sender, ownerOfToken2, _tokenId1);

            //Take from owner of second token and replace what was given by msg.sender
            transferFrom(ownerOfToken2, msg.sender, _tokenId2);
        }else{
            // It means that ownerOfToken2 is our msg.sender

            // Take from msg.sender and give to owner of first token
            transferFrom(msg.sender, ownerOfToken1, _tokenId2);

            //Take from owner of first token and replace what was given by msg.sender
            transferFrom(ownerOfToken1, msg.sender, _tokenId1);
        }


        //1. Passing to star tokenId you will need to check if the owner of _tokenId1 or _tokenId2 is the sender
        //2. You don't have to check for the price of the token (star)
        //3. Get the owner of the two tokens (ownerOf(_tokenId1), ownerOf(_tokenId2)
        //4. Use _transferFrom function to exchange the tokens.
    }

    // Implement Task 1 Transfer Stars
    function transferStar(address _to1, uint256 _tokenId) public {
        //1. Check if the sender is the ownerOf(_tokenId)
        require(msg.sender == ownerOf(_tokenId),"You cant transfer the Star you don't own");

        //2. Use the transferFrom(from, to, tokenId); function to transfer the Star
        transferFrom(msg.sender, _to1, _tokenId);
    }

}

//SPDX-License-Identifier: MIT

pragma solidity ^0.8.2;

import './IERC721.sol';
import './IERC721Metadata.sol';
import './IERC721Enumerable.sol';
import './IERC721TokenReceiver.sol';

import './IERC2981.sol';
import './IERC165.sol';

import '../Utils/Strings.sol';

abstract contract ERC721 is IERC165, IERC721, IERC721Metadata, IERC721Enumerable, IERC2981 {
    // String extensions for uint256
    using Strings for uint256;

    // Token name
    string private _name;

    // Token symbol
    string private _symbol;

    // Token supply
    uint256 private _tokenSupply;

    // Token Id to owner address mapping
    mapping (uint256 => address) private _owners;

    // Owner address to token count
    mapping (address => uint256) private _balances;

    // Token Id to approved address 
    mapping (uint256 => address) private _tokenApprovals;

    // Owner to operator mapping
    mapping (address => mapping(address => bool)) _operatorApprovals;

    // Token Id to Token URI mapping
    mapping (uint256 => string) internal _tokenURIs;

    constructor(string memory name_, string memory symbol_) {
        _name = name_;
        _symbol = symbol_;
    }

    /*
    *  @dev See {IERC165-supportsInterface}.
    */ 
    function supportsInterface(bytes4 interfaceID) public view virtual override (IERC165) returns (bool) {
        return (
            interfaceID == type(IERC721).interfaceId ||
            interfaceID == type(IERC721Metadata).interfaceId ||
            interfaceID == type(IERC721Enumerable).interfaceId ||
            interfaceID == type(IERC165).interfaceId);
    }

    /*
    *  @dev See {IERC721Metadata-name}.
    */ 
    function name() public view virtual override returns (string memory) {
        return _name;
    }

    /*
    *  @dev See {IERC721Metadata-symbol}.
    */ 
    function symbol() public view virtual override returns (string memory) {
        return _symbol;
    }

    /*
    *  @dev See {IERC721Metadata-tokenURI}.
    */ 
    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        require(_owners[tokenId] != address(0), "ERC721Metadata:  URI query for nonexistent token");
        return _tokenURIs[tokenId];
    }

    /*
    *  @dev See {IERC721Enumerable-totalSupply}.
    */ 
    function totalSupply() public view virtual override returns (uint256) {
        return _tokenSupply;
    }

    /*
    *  @dev See {IERC721Enumerable-tokenByIndex}.
    */ 
    function tokenByIndex(uint256 index) public view virtual override returns (uint256) {
        require(index > _tokenSupply, "ERC721Enumerable: Index greater than token supply");

        // TODO return token at index
        return _tokenSupply;
    }

    /*
    *  @dev See {IERC721Enumerable-tokenByIndex}.
    */ 
    function tokenOfOwnerByIndex(address owner, uint256 index) public view virtual override returns (uint256) {
        require(index > _tokenSupply, "ERC721Enumerable: Index greater than token supply");

        // TODO return token at index
        return _tokenSupply;
    }


    /*
    *  @dev See {IERC721-ownerOf}.
    */ 
    function ownerOf(uint256 tokenId) public view virtual override (IERC721) returns (address) {
        require(_owners[tokenId] != address(0), "ERC721: owner query for nonexistent token");
        return _owners[tokenId];
    }

    /*
    *  @dev See {IERC721-balanceOf}.
    */ 
    function balanceOf(address owner) public view virtual override returns(uint256) {
        require(owner != address(0), "ERC721: Balance query for zero address");
        return _balances[owner];
    }

    /*
    *  @dev See {IERC721-approve}.
    */ 
    function approve(address to, uint256 tokenId) public virtual override payable {
        address owner = ownerOf(tokenId);
        require(to != owner, "ERC721: Approval to existing owner");
        require(msg.sender == owner, "ERC721: caller is not owner");

        // To address now approved to manage the token
        //
        _tokenApprovals[tokenId] = to;

        emit Approval(owner, to, tokenId);
    }

    /*
    *  @dev See {IERC721-getApproved}.
    */ 
    function getApproved(uint256 tokenId) public view virtual override returns (address) {
        require(_owners[tokenId] != address(0), "ERC721Metadata:  URI query for nonexistent token");
        return _tokenApprovals[tokenId];
    }

    /*
    *  @dev See {IERC721-setApprovalForAll}.
    */ 
    function setApprovalForAll(address operator, bool approved) public virtual override {
        require(operator != msg.sender, "ERC721: Approval to existing owner");

        // Allow this address to manage all tokens for owner
        //
        _operatorApprovals[msg.sender][operator] = approved;

        emit ApprovalForAll(msg.sender, operator, approved);
    }

    /*
    *  @dev See {IERC721-isApprovedForAll}.
    */ 
    function isApprovedForAll(address owner, address operator) public view virtual override returns(bool) {
        return _operatorApprovals[owner][operator];
    }

    /*
    *  @dev See {IERC721-transferFrom}.
    */ 
    function transferFrom(address from, address to, uint256 tokenId) public virtual override payable {
        require(_isApproved(msg.sender, tokenId), "ERC721: Caller is not approved to manage this token");
        
        _transfer(from, to, tokenId);
    }

    /*
    *  @dev See {IERC721-safeTransferFrom}.
    */ 
    function safeTransferFrom(address from, address to, uint256 tokenId) public virtual override payable {
        safeTransferFrom(from, to, tokenId, "");
    }

    /*
    *  @dev See {IERC721-safeTransferFrom}.
    */ 
    function safeTransferFrom(address from, address to, uint256 tokenId, bytes memory data) public virtual override payable {
        require(_isApproved(msg.sender, tokenId), "ERC721: Caller is not approved to manage this token");
        
        _transfer(from, to, tokenId);

        // If receiver is a contract, call the contract to validate the transfer
        //
        require(_isERC721Received(from, to, tokenId, data), "ERC721: Transfer to non ERC721Receiver contract");
    }

    /*
    * *  Internal helpers
    * * *
    * * * *
    * * * * */

    /*
    *  @dev Initiates a transfer.
    */ 
    function _transfer(address from, address to, uint256 tokenId) internal virtual {
        require(ownerOf(tokenId) == from, "ERC721: From address does not own this token");
        require(to != address(0), "ERC721: Transfer to a zero address");

        // Remove existing approver from the previous owner
        //
        _tokenApprovals[tokenId] = address(0);

        // Update balances
        //
        _balances[from] -= 1;
        _balances[to] += 1;

        // Finally, tyransfer ownership to the new address
        //
        _owners[tokenId] = to;

        emit Transfer(from, to, tokenId);
    }

    /*
    *  @dev Mint a new token
    */ 
    function _mint(address to, uint256 tokenId) internal virtual {
        require(to != address(0), "ERC721: Transfer to a zero address");
        require(_owners[tokenId] == address(0), "ERC721: Token already exists");

        // Update balance
        //
        _balances[to] += 1;

        // Keep track of total supply
        //
        _tokenSupply += 1;

        // Transfer ownership to the new address
        //
        _owners[tokenId] = to;

        emit Transfer(address(0), to, tokenId);
    }

    /*
    *  @dev Returns true if requester is approved to manage the token.
    */ 
    function _isApproved(address from, uint256 tokenId) internal view virtual returns (bool) {
        address owner = _owners[tokenId];

        require(owner != address(0), "ERC721:  URI query for nonexistent token");

        // Owner, approved address (for this token or all tokens)
        //
        return 
            (owner == from || 
            _tokenApprovals[tokenId] == from || 
            _operatorApprovals[owner][from]);
    }

    /*
    *  @dev Initiates a transfer.
    */ 
    function _isERC721Received(address from, address to, uint256 tokenId, bytes memory data) internal returns (bool) {
        uint256 size;

        // solhint-disable-next-line no-inline-assembly
        assembly { 
            size := extcodesize(to) 
        }

        // Address is a contract
        //
        if (size > 0) {
            try IERC721TokenReceiver(to).onERC721Received(msg.sender, from, tokenId, data) returns (bytes4 retval) {
                if (retval != IERC721TokenReceiver(to).onERC721Received.selector)
                    return false;
            } catch (bytes memory reason) {
                if (reason.length == 0) {
                    revert("ERC721: transfer to non ERC721Receiver implementer");
                } 
                else {
                    // solhint-disable-next-line no-inline-assembly
                    assembly {
                        revert(add(32, reason), mload(reason))
                    }
                }
            }
        }
        
        return true;
    }
}
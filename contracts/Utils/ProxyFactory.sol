//SPDX-License-Identifier: MIT
//solhint-disable max-line-length
//solhint-disable no-inline-assembly

pragma solidity ^0.8.2;

contract ProxyFactory {

  function createProxy(address target) internal returns (address result) {
    bytes20 targetBytes = bytes20(target);

    assembly {
      let proxy := mload(0x40)
      mstore(proxy, 0x3d602d80600a3d3981f3363d3d373d3d3d363d73000000000000000000000000)
      mstore(add(proxy, 0x14), targetBytes)
      mstore(add(proxy, 0x28), 0x5af43d82803e903d91602b57fd5bf30000000000000000000000000000000000)
      result := create(0, proxy, 0x37)
    }
  }

  function isProxy(address target, address query) internal view returns (bool result) {
    bytes20 targetBytes = bytes20(target);
    
    assembly {
      let proxy := mload(0x40)
      mstore(proxy, 0x363d3d373d3d3d363d7300000000000000000000000000000000000000000000)
      mstore(add(proxy, 0xa), targetBytes)
      mstore(add(proxy, 0x1e), 0x5af43d82803e903d91602b57fd5bf30000000000000000000000000000000000)

      let other := add(proxy, 0x40)
      extcodecopy(query, other, 0, 0x2d)
      result := and(
        eq(mload(proxy), mload(other)),
        eq(mload(add(proxy, 0xd)), mload(add(other, 0xd)))
      )
    }
  }
}
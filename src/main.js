import Web3 from "web3"
import { newKitFromWeb3 } from "@celo/contractkit"
import BigNumber from "bignumber.js"
import marketplaceAbi from "../contract/marketplace.abi.json"
import erc20Abi from "../contract/erc20.abi.json"

const ERC20_DECIMALS = 18
//const MPContractAddress = "0x178134c92EC973F34dD0dd762284b852B211CFC8"
const MPContractAddress = "0xEE61Db75B18A5D84119E7cE9840bc2BFbD8F1dc7"
const cUSDContractAddress = "0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1"

let kit
let contract
let products = []
let attedance = [1,3,5,6,7]
const connectCeloWallet = async function () {
  if (window.celo) {
    notification("⚠️ Please approve this DApp to use it.")
    try {
      await window.celo.enable()
      notificationOff()

      const web3 = new Web3(window.celo)
      kit = newKitFromWeb3(web3)

      const accounts = await kit.web3.eth.getAccounts()
      kit.defaultAccount = accounts[0]

      contract = new kit.web3.eth.Contract(marketplaceAbi, MPContractAddress)
    } catch (error) {
      notification(`⚠️ ${error}.`)
    }
  } else {
    notification("⚠️ Please install the CeloExtensionWallet.")
  }
}

async function approve(_price) {
  const cUSDContract = new kit.web3.eth.Contract(erc20Abi, cUSDContractAddress)

  const result = await cUSDContract.methods
    .approve(MPContractAddress, _price)
    .send({ from: kit.defaultAccount })
  return result
}

const getBalance = async function () {
  const totalBalance = await kit.getTotalBalance(kit.defaultAccount)
  const cUSDBalance = totalBalance.cUSD.shiftedBy(-ERC20_DECIMALS).toFixed(2)
  document.querySelector("#balance").textContent = cUSDBalance
}

const getProducts = async function() {
  const _productsLength = await contract.methods.getEventLength().call()
  const _products = []
  for (let i = 0; i < _productsLength; i++) {
    let _product = new Promise(async (resolve, reject) => {
      let p = await contract.methods.getEventById(i).call()
      resolve({
        index: i,
        owner: p[0],
        eventName: p[1],
        eventDetails: p[2],
        datePosted: p[3],
        eventCard: p[4]
      })

      console.log(p)
    })


    _products.push(_product)
  }
  products = await Promise.all(_products)

  renderProducts()
}

function renderProducts() {
  document.getElementById("marketplace").innerHTML = ""
  if (products) {
  products.forEach((_product) => {
    if (_product.owner != "0x0000000000000000000000000000000000000000") {
    const newDiv = document.createElement("div")
    newDiv.className = "col-md-4"
    newDiv.innerHTML = productTemplate(_product)
    document.getElementById("marketplace").appendChild(newDiv)
  }
  
  })
}
else {
  console.log("array is empty")
}
}

function productTemplate(_product) {
  let base =  `
 <div class="card mb-4">
      <img class="card-img-top" src="${_product.eventCard}" alt="...">
      <div class="position-absolute  top-0 end-0 bg-danger mt-4 px-2 py-1 rounded">
      <i class="bi bi-trash-fill deleteBtn" style="color : white;" id="${_product.index}"></i>
      </div> 
  <div class="card-body text-left p-4 position-relative">
        <div class="translate-middle-y position-absolute top-0"  id="${_product.index}">
        ${identiconTemplate(_product.owner)}
        </div>
        <h4 class="card-title fs-4 fw-bold mt-2">${_product.eventName}</h4>
        <p class="card-text mb-1" style="min-height: 82px;
  width: 250px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis">
          ${_product.eventDetails}             
        </p>


        <p class="card-text mt-1">
          <i class="bi bi-calendar-event-fill"></i>
           <span>${_product.eventDetails}</span>
        </p>

        <p class="card-text mt-4">
          <i class="bi bi-geo-alt-fill"></i>
          <span>${_product.location}</span>
        </p>
        
      </div>
    </div>
    `

     base += `
     <div class="mt-2 mx-2" style="display: flex;
  justify-content: space-between;">
     <div> <a class="btn btn-sm btn-dark Reviews" 
     id="${_product.index}">Reviews</a></div>

          <div> <a class="btn btn-sm btn-dark views"
           id="${_product.index}">View</a></div>
           </div>

           <div> <a class="btn btn-sm btn-dark attendee"
           id="${_product.index}">Attend</a></div>
           </div>
           `;

    // Reviews section
    base += `
    <div id="comment-review${_product.index}" style="display: none;">
    <ul class="d-grid gap dibba mt-3 pt-2 pr-2 pl-2" id="review${_product.index}">
    </ul> 
    
    <div class="card-footer py-3 border-0 mt-3" style="background-color: #f8f9fa;">
            <div class="d-flex flex-start w-100">
              <div class="form-outline w-100">
                <textarea class="form-control" id="textAreaExample${_product.index}" rows="4"
                  style="background: #fff;"></textarea>
                <label class="form-label" for="textAreaExample">Comments</label>
              </div>
            </div>
            <div class="float-end mt-2 pt-1">
              <button type="button" class="btn btn-success Postcomment" id="${_product.index}">Post comment</button>
            </div>
      </div>`
  return base
}

//view id event
function productTemplate1(_product) {
  let base =  `
 <div class="card mb-4">
      <img class="card-img-top" src="${_product.eventCard}" alt="...">
      <div class="position-absolute top-0 end-0 bg-warning mt-4 px-2 py-1 rounded-start">
      </div> 
  <div class="card-body text-left p-4 position-relative">
        <div class="translate-middle-y position-absolute top-0">
        ${identiconTemplate(_product.owner)}
        </div>
        <h4 class="card-title fs-4 fw-bold mt-2">${_product.eventName}</h4>
        <p class="card-text mb-1" style="min-height: 82px">
          ${_product.eventDetails}             
        </p>
        <p class="card-text mt-1">
          <i class="bi bi-calendar-event-fill"></i>
           <span>${_product.eventDetails}</span>
        </p>

        <p class="card-text mt-4">
          <i class="bi bi-geo-alt-fill"></i>
          <span>${_product.location}</span>
        </p>
              </div>
    </div>
    `
     base += `<div class="d-grid gap mt-2"> <a class="btn btn-lg btn-dark Reviews" id="${_product.index}">Reviews</a></div>
          <div class="d-grid gap mt-2"> <a class="btn btn-lg btn-dark Reviews" id="${_product.index}">View</a></div>
     `; 
  return base
}

//--iconakak nk k

function identiconTemplate(_address) {
  const icon = blockies
    .create({
      seed: _address,
      size: 5,
      scale: 5,
    })
    .toDataURL()

  return `
  <div class="rounded-circle overflow-hidden d-inline-block border border-white border-2 shadow-sm m-0">
    <a href="https://alfajores-blockscout.celo-testnet.org/address/${_address}/transactions"
        target="_blank">
        <img src="${icon}" width="40" alt="${_address}">
    </a>
  </div>
  `
}

function notification(_text) {
  document.querySelector(".alert").style.display = "block"
  document.querySelector("#notification").textContent = _text
}

function notificationOff() {
  document.querySelector(".alert").style.display = "none"
}

window.addEventListener("load", async () => {
  notification("⌛ Loading...")
  await connectCeloWallet()
  await getBalance()
  await getProducts()
  notificationOff()
   console.log("rro", products[0].owner)
});

document
  .querySelector("#newProductBtn")
  .addEventListener("click", async (e) => {
    const params = [
      document.getElementById("eventName").value,
      document.getElementById("eventDetails").value,
      document.getElementById("eventCardImg").value,
    ]
    notification(`⌛ Adding "${params[0]}"...`)
    try {
      const result = await contract.methods
        .createEvent(...params)
        .send({ from: kit.defaultAccount })
    } catch (error) {
      notification(`⚠️ ${error}.`)
    }
    notification(`🎉 You successfully added "${params[0]}".`)
    getProducts()
  })



document.querySelector("#marketplace").addEventListener("click", async (e) => {
  if (e.target.className.includes("deleteBtn")) {
    const index = e.target.id

    notification("⌛ Waiting for payment approval...")
    
    try {
      const result = await contract.methods
        .deleteEventById(index)
        .send({ from: kit.defaultAccount })
      notification(`🎉 You successfully bought.`)
      getProducts()
      getBalance()
    } catch (error) {
      notification(`⚠️ ${error}.`)
    }
  }


   else if(e.target.className.includes("Reviews")) {
    const index = e.target.id;
    const vis = document.getElementById(`comment-review${index}`).style.display;

    // checks if the review section is visible or not
    if(vis === "none") {
        // loading notification
       // notification("⌛ Loading Reviews...");
       let Comments;
       let Comments1;
       // calls the getReview method on the contract with the index of the product as parameter
       try {
          Comments = await contract.methods.getReview(index).call();
          Comments1 = await contract.methods.getEventComment(index).call();
          console.log(Comments);
           // console.log("Comments1", Comments1.comment);

          // if there are no reviews
          if(Comments.length === 0) {
            document.getElementById(`review${index}`).innerHTML = "No reviews yet";
          }
          else{
            document.getElementById(`review${index}`).innerHTML = "";
          }

          Comments1.forEach((comment) => {

              // document.getElementById(`review${index}`).innerHTML += `<li class=" p-2 comment mt-1"> ${comment} </li>`;
            console.log(comment[2])
          });

          // loops through the comments and appends them to the review section
          Comments.forEach((comment) => {
              document.getElementById(`review${index}`).innerHTML += `<li class=" p-2 comment mt-1"> ${comment} </li>`;
          });
        //  notificationOff();
          document.getElementById(`comment-review${index}`).style.display = "block";
       }
        catch(error) {
          console.log(error);
          notification(`⚠️ ${error}.`, "error");
        }
    }
  }
    else if(e.target.className.includes("views")){
      const _id = e.target.id;
      let viewEvents;
      let attendees;
      try {
          viewEvents = await contract.methods.getEventById(_id).call();
          attendees = await contract.methods.getAttendees(_id).call();
          console.log("viewEvents", viewEvents[1])
          console.log("attendee...", attendees)
          document.getElementById("marketplace1").innerHTML = `
          <div class="card mb-4">
      <img class="card-img-top" src="${viewEvents[4]}" alt="...">
      <div class="position-absolute top-0 end-0 bg-warning mt-4 px-2 py-1 rounded-start">
      </div> 
  <div class="card-body text-left p-4 position-relative">
        <div class="translate-middle-y position-absolute top-0">
        ${identiconTemplate(viewEvents[0])}
        </div>
        <h4 class="card-title fs-4 fw-bold mt-2">${viewEvents[1]}</h4>
        <p class="card-text mb-1" style="min-height: 82px;
  width: 250px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis">
          ${viewEvents[2]}             
        </p>


        <p class="card-text mt-1">
          <i class="bi bi-calendar-event-fill"></i>
           <span>${viewEvents[3]}</span>
        </p>

        <p class="card-text mt-4">
          <i class="bi bi-geo-alt-fill"></i>
          <span>${viewEvents[4]}</span>
        </p>
      </div>

      <div id="att"></div>

    </div>
          `
          attendees.forEach((item) => {
            document.getElementById(`att`).innerHTML += `${identiconTemplate(item)}`;
          })
          
    }
    catch (error) {
      notification(`⚠️ ${error}.`)
    }
  }

  else if(e.target.className.includes("attendee")){
    const _id = e.target.id;

    notification(`⌛ Adding ...`)
    try {
      const result = await contract.methods
        .addEventAttendees(_id)
        .send({ from: kit.defaultAccount })
    } catch (error) {
      notification(`⚠️ ${error}.`)
    }
    notification(`🎉 You successfully added .`)
    getProducts()
  }


    // if the review section is visible
    // else {
    //   document.getElementById(`comment-review${index}`).style.display = "none";
    //   notificationOff();
    // }
  

})  


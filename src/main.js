import Web3 from "web3"
import { newKitFromWeb3 } from "@celo/contractkit"
import BigNumber from "bignumber.js"
import marketplaceAbi from "../contract/marketplace.abi.json"
import erc20Abi from "../contract/erc20.abi.json"

const ERC20_DECIMALS = 18
const MPContractAddress = "0x104F2Eed175E091Cf4Ab62896917f393B990307a"
const cUSDContractAddress = "0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1"

let kit
let contract
let eventLists = []

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

const getEventLists = async function() {
  const eventLength = await contract.methods.getEventLength().call()
  const _eventLists = []
  for (let i = 0; i < eventLength; i++) {
    let event = new Promise(async (resolve, reject) => {
      let p = await contract.methods.getEventById(i).call()
      resolve({
        index: i,
        owner: p[0],
        eventName: p[1],
        eventCardImgUrl: p[2],
        eventDetails: p[3],
        eventDate: p[4],
        eventTime: p[5],
        eventLocation : p[6]
      })

      console.log(p)
    })


    _eventLists.push(event)
  }
  eventLists = await Promise.all(_eventLists)

  renderEvents()
}

function renderEvents() {
  document.getElementById("marketplace").innerHTML = ""
  if (eventLists) {
  eventLists.forEach((event) => {
    if (event.owner != "0x0000000000000000000000000000000000000000") {
    const newDiv = document.createElement("div")
    newDiv.className = "col-md-3"
    newDiv.innerHTML = eventTemplate(event)
    document.getElementById("marketplace").appendChild(newDiv)
  }
  
  })
}
else {
  console.log("array is empty")
}
}

function eventTemplate(event) {
  let base =  `
 <div class="card mb-4 shadow">
      <img class="card-img-top" src="${event.eventCardImgUrl}" alt="...">
      <div class="position-absolute  top-0 end-0 bg-danger mt-4 px-2 py-1 rounded" style="cursor : pointer;">
      <i class="bi bi-trash-fill deleteBtn" style="color : white;" id="${event.index}"></i>
      </div> 
  <div class="card-body text-left p-3 position-relative"
   style="background-color : rgb(255,218,185)">
        <div class="translate-middle-y position-absolute top-0"  id="${event.index}">
        ${identiconTemplate(event.owner)}
        </div>
        <h5 class="card-title  fw-bold mt-2">${event.eventName}</h5>
        <p class="card-text mb-2" style="
  width: 250px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis">
          ${event.eventDetails}             
        </p>
<div style="display: flex;
  justify-content: space-between;">
      

           <div> <a class="btn btn-sm btn-success attendee"
           id="${event.index}">Join</a></div>
           

           <div> <a class="btn btn-sm btn-dark view"
           id="${event.index}">View</a></div>
          </div>

    
      </div>
    </div>
    `
  return base
}



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
  await getEventLists()
  notificationOff()
});

document
  .querySelector("#postEventBtn")
  .addEventListener("click", async (e) => {
    const params = [
      document.getElementById("eventName").value,
      document.getElementById("eventCardImgUrl").value,
      document.getElementById("eventDetails").value,
      document.getElementById("eventDate").value,
      document.getElementById("eventTime").value,
      document.getElementById("eventLocation").value,
    ]
    notification(`⌛ Posting your event to the blockchain please wait...`)
    try {
      const result = await contract.methods
        .createEvent(...params)
        .send({ from: kit.defaultAccount })
    } catch (error) {
      notification(`⚠️ ${error}.`)
    }
    notification(`🎉 Congrats event successfully added`)
    getEventLists()
  })



document.querySelector("#marketplace").addEventListener("click", async (e) => {
  if (e.target.className.includes("deleteBtn")) {
    const index = e.target.id

    notification("⌛ Please wait, your action is being processed...")
    
    try {
      const result = await contract.methods
        .deleteEventById(index)
        .send({ from: kit.defaultAccount })
      notification(`You have deleted an event successfully`)
      getEventLists()
      getBalance()
    } catch (error) {
      notification(`⚠️ you are not the owner of this event`)
    }
  }


    else if(e.target.className.includes("view")){
      const _id = e.target.id;
      let eventData;
      let attendees;
      try {
          eventData = await contract.methods.getEventById(_id).call();
          attendees = await contract.methods.getAttendees(_id).call();
          let myModal = new bootstrap.Modal(document.getElementById('addModal1'), {});
myModal.show();

document.getElementById("modalHeader").innerHTML = `
<div class="card mb-4">
      <img style="width : 100%; height : 20vw;" src="${eventData[2]}" alt="...">
      <div class="position-absolute top-0 end-0 bg-warning mt-4 px-2 py-1 rounded-start">
      </div> 
  <div class="card-body text-left p-4 position-relative">
        <div class="translate-middle-y position-absolute top-0">
        ${identiconTemplate(eventData[0])}
        </div>
        <h5 class="card-title  fw-bold mt-2">${eventData[1]}</h5>
        <p class="card-text mb-3">
          ${eventData[3]}             
        </p>


        <div class="d-flex p-2" style="border : 1px solid grey; border-radius : 2px;" > 
        <p class="card-text mt-1 ">
          <i class="bi bi-calendar-event-fill"></i>
           <span>${new Date(eventData[4]).toDateString()}</span>
        </p>

        <p class="card-text mt-1 mx-3">
          <i class="bi bi-clock-fill"></i>
           <span>${eventData[5]}</span>
        </p>
        </div>

        <p class="card-text mt-2 p-2" style="border : 1px solid grey; border-radius : 2px;">
          <i class="bi bi-geo-alt-fill"></i>
          <span>${eventData[6]}</span>
        </p>

        <hr />
      <p class="card-text">Attendees:</p>
      <div id="att"></div>

      </div>

      
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

    notification(`⌛ Processing your request please wait ...`)
    try {
      const result = await contract.methods
        .addEventAttendees(_id)
        .send({ from: kit.defaultAccount })
    } catch (error) {
      notification(`⚠️ ${error}.`)
    }
    notification(`🎉 You are now one of the attendee .`)
    getEventLists()
  }

})  

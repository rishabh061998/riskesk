import react,{useState,useEffect} from "react"
import axios from "axios"
import {MDBTable,MDBTableHead,MDBTableBody,MDBRow,MDBCol,MDBContainer,MDBBtn,MDBBtnGroup,MDBPaginationItem,MDBPagination,MDBPaginationLink} from "mdb-react-ui-kit"
import './App.css';

function App() {

  const [data,setData]=useState([]);
  const [value,setValue]=useState("");
  const [sortValue,setSortValue]=useState("");
  const [currentPage,setCurrentPage]=useState(0);
  const [pageLimit]=useState(4);

  const sortOptions=["name","address",'email',"phone","status"]

  useEffect(()=>{
    loadUserData(0,4,0)
  },[])

  const loadUserData=async(start,end,increase)=>{
    return await axios.get(`https://riskesk-url.herokuapp.com/users?_start=${start}&_end=${end}`).then((response)=>{
      setData(response.data)
      setCurrentPage(currentPage+increase)
    }).catch((err)=>console.log(err))
  }

  console.log("data",data)

  const handleReset=()=>{
loadUserData(0,4,0)
  }

  
  const handleSearch=async(e)=>{
    e.preventDefault();
    return await axios.get(`https://riskesk-url.herokuapp.com/users?q=${value}`).then((response)=>{
      setData(response.data);
      setValue("")
    }).catch((err)=>console.log(err))
  }


  const handleSort=async(e)=>{
   let value=e.target.value;
   setSortValue(value)
    return await axios.get(`https://riskesk-url.herokuapp.com/users?_sort=${value}&_order=asc`).then((response)=>{
      setData(response.data);
      
    }).catch((err)=>console.log(err))
  }

  const handleFilter=async(value)=>{
   
     return await axios.get(`https://riskesk-url.herokuapp.com/users?status=${value}`).then((response)=>{
       setData(response.data);
       
     }).catch((err)=>console.log(err))
   }
 
  const renderPagination=()=>{
    if(currentPage===0){
      return(
        <MDBPagination className="mb-0">
          <MDBPaginationItem>
            <MDBPaginationLink>1</MDBPaginationLink>
          </MDBPaginationItem>
          <MDBPaginationItem>
            <MDBBtn onClick={()=>loadUserData(4,8,1)}>
              Next
            </MDBBtn>
          </MDBPaginationItem>
        </MDBPagination>
      )
    }
    else if(currentPage<pageLimit-1 && data.length===pageLimit){
      return(
        <MDBPagination className="mb-0">
         
        <MDBPaginationItem>
          <MDBBtn onClick={()=>loadUserData((currentPage-1)*4,currentPage*4,-1)}>
            Previous
          </MDBBtn>
        </MDBPaginationItem>
        <MDBPaginationItem>
        <MDBPaginationLink>{currentPage + 1}</MDBPaginationLink>
        </MDBPaginationItem>
       
       
        <MDBPaginationItem>
          <MDBBtn onClick={()=>loadUserData((currentPage+1)*4,(currentPage+2)*4,1)}>
            Next
          </MDBBtn>
        </MDBPaginationItem>
      </MDBPagination>
      )
    }
    else{
      return(
        <MDBPagination className="mb-0">
         
          <MDBPaginationItem>
            <MDBBtn onClick={()=>loadUserData(4,8,-1)}>
              Previous
            </MDBBtn>
          </MDBPaginationItem>
          <MDBPaginationItem>
            <MDBPaginationLink>{currentPage+1}</MDBPaginationLink>
          </MDBPaginationItem>
        </MDBPagination>
      )
    }
  }


  return (
   <MDBContainer>
    <form style={{margin:"auto",padding:"15px",maxWidth:"480px",alignContent:"center"}} className="d-flex input-group w-auto" onSubmit={handleSearch}>

   <input type="text" className="form-control" placeholder="Search Name" value={value} onChange={(e)=>setValue(e.target.value)}></input>

   
    <MDBBtn type="submit" color="dark">Search</MDBBtn>
    <MDBBtn className="mx-2" color="info" onClick={()=>handleReset()}>Reset</MDBBtn>
   
    </form>
<div style={{marginTop:"100px"}}>
  <h2 className="text-center">Search,Filter,Sort and Pagination using Json server</h2>
  <MDBRow>
    <MDBCol size="12">
     <MDBTable>
      <MDBTableHead dark>
            <tr>
              <th scope="col">No.</th>
              <th scope="col">Name</th>
              <th scope="col">Email</th>
              <th scope="col">Phone</th>
              <th scope="col">Address</th>
              <th scope="col">Status</th>
            </tr>
      </MDBTableHead>
      {data.length==0 ?(
        <MDBTableBody className="align-center mb-0">
         <tr>
          <td colSpan={8} className="text-center mb-0">No data found</td>
         </tr>
        </MDBTableBody>
      ):(
        data.map((item,index)=>(
          <MDBTableBody key={index}>
              <tr>
                <th scope="row">{index+1}</th>
                <td>{item.name}</td>
                <td>{item.email}</td>
                <td>{item.phone}</td>
                <td>{item.address}</td>
                <td>{item.status}</td>
          
              </tr>
          </MDBTableBody>
        ))
      )}
     </MDBTable>
    </MDBCol>
  </MDBRow>
  <div style={{margin:"auto",padding:"15px",maxWidth:"250px",alignContent:"center"}}>
    {renderPagination()}
  </div>
</div>

<MDBRow>
  <MDBCol size="8">
    <h5>Sort By:</h5>
  <select style={{width:"50%", borderRadius:"2px", heigth:"35px"}} onChange={handleSort}
  value={sortValue}>
<option>Please Select Value</option>
{sortOptions.map((item,index)=>(
  <option value={item} key={index}>{item}</option>
))}
  </select>
  
  </MDBCol>
  <MDBCol size="4"><h5>Filter By status:</h5>
  <MDBBtnGroup>
    <MDBBtn color="success" onClick={()=>handleFilter("Active")}>Active</MDBBtn>
    <MDBBtn color="danger" style={{marginLeft:"2px"}} onClick={()=>handleFilter("Inactive")}>InActive</MDBBtn>
  </MDBBtnGroup>
  
  </MDBCol>
</MDBRow>

    </MDBContainer>
  );
}

export default App;



//http://localhost:5000/users
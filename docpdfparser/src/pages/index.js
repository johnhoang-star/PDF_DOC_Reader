import React,{useState} from 'react'
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import LoadingButton from '@mui/lab/LoadingButton';
import Input from '@mui/material/Input';
import DataTable from './mtable'
import {toast} from 'react-toastify' 
import {
	Container
} from './styles'

export const Content = ()=>{

const [image, setImage] = useState(null);
const [filename,setFileName] = useState('No File Selected');
const [data,setData] = useState([])
const url = 'http://localhost:5000';

const Recognize = async() =>{

	if(filename == '')
		{ 
			alert('please select file');
			return;
		}


	setIsLoading(true)
	const data = {fileName : filename, exclude : exclude};   
    const res = await fetch(url + '/start', {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Origin': '',
      },
      body: JSON.stringify(data) ,
    });
    var result = []
    const response = await res.json()
	 	
    var keys = Object.keys(response.result);
     for(var i = 0 ;i < keys.length ;i ++){
   		result.push({id: (i+1) , word : keys[i], counts : response.result[keys[i]],define: response.example[keys[i]],level : '',pronounciation : '',meaning : '',mnemonics:''}) 	
    }
	setData(result)
	setIsLoading(false)
}

const Reset = () =>{
	setFileName('')
	setIsLoading(false)
	setData([])
}
const handleUploadImage = async (e) =>{
 
    const formData = new FormData();
    setFileName(e.target.files[0].name)
    formData.append("files", e.target.files[0]);    
    const res = await fetch(url + '/upload', {
        method: "POST",
        mode: 'no-cors',
        body: formData,	   
    });

}
const [loading,setIsLoading] = useState(false)
const [exclude,setExclude] = useState('is am the was were the a an  , . ! ( )  # _ = as & - | for be on at in : by and of to with % + * /')
const ariaLabel = { 'aria-label': 'description' };
	return (
		 	<div>
				<h1> Extract Information</h1>
				 <Stack spacing={2} direction="row" style = {{justifyContent: 'center'}}>
					<Button variant="contained" component="label">
					  Upload
					  <input hidden accept=".pdf,.doc,.docx"  type="file" onChange={handleUploadImage} />
					</Button>
					  <Input defaultValue={exclude} onChange={e=>setExclude(e.target.value)} inputProps={ariaLabel}  style = {{width : 500,marginLeft:50}}/>
				</Stack>
				<Stack spacing={2} direction="row" style = {{justifyContent: 'center',marginTop:10}}>
					
				</Stack>
				 <Stack spacing={2} direction="row" style = {{justifyContent: 'center'}}>
				 <Input defaultValue="Project Name" inputProps={ariaLabel}  style = {{width : 420}}/>
					<LoadingButton loading = {loading} variant="contained" color = 'success' onClick = {Recognize}>
        				Scan now
      				</LoadingButton>
					<Button variant="contained" color = 'error' onClick = {Reset} >Reset</Button>	
				</Stack>
			 
				
				<Container>
					<DataTable data = {data}/>
				</Container>
		    </div>
		)
}
import '../styles/Home.css';
import { useLocation } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
function Home(){

    const location = useLocation();
    const { user } = location.state || {};
    const rollnumber = user ? user.rollnumber : 'No roll number provided';
    const password = user ? user.password : 'No password';

    const notify = (msg,typ) => {
        if(typ==='s'){
            toast.success(msg);
        }
        else if(typ==='e'){
            toast.error(msg);
        }
        else if(typ==='i'){
            toast.info(msg);
        }
        else if(typ==='w'){
            toast.warning(msg);
        }

      };

    const navigate = useNavigate();

    window.addEventListener("beforeunload", function (event) {
        event.preventDefault();
        // Some browsers require this to display the prompt
        event.returnValue = '';
    });
    
    const mainServerUrl ="https://svpcettapserver-raj1.onrender.com/";

    let [allFiles,setallFiles] = useState([]);


    function toggleSaveFile() {
        document.getElementById('savefile').style.display = 'none';
        document.getElementById('opendelfile').style.display = 'none';
        document.getElementById('updatedet').style.display='none';
        const saveFileDiv = document.getElementById('savefile');
        const saveFileDiv1 = document.getElementById('opendelfile');
        if(saveFileDiv1.style.display === 'flex'){
            saveFileDiv1.style.display = 'none';
        }
        if (saveFileDiv.style.display === 'none' || saveFileDiv.style.display === '') {
          saveFileDiv.style.display = 'flex';
        } else {
          saveFileDiv.style.display = 'none';
        }

      }

      function showup() {
        const div = document.getElementById('updatedet');
        if (div.style.display === 'none' || div.style.display === '') {
          div.style.display = 'flex';
        } else {
          div.style.display = 'none';
        }
      }





      async function updatepassword(){
        let newpass = document.getElementById('newpass').value.trim();
        if(newpass.length<5){
            notify('Password must be grater then 4','w');
        }
        else{
        try {
            notify('Please wait','w');

            let dataToServer = {
                rollnumber : rollnumber,
                newpass : newpass
            }
            

            const response = await fetch(mainServerUrl+'updatepassword', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',

              },
              body: JSON.stringify(dataToServer),
            });
    
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const {message} = await response.json();

        if(message==='Password changed successfully'){
            notify(message,'s');
        }
        else if(message==='No changes made'){
            notify(message,'s');
        }
        else{
            notify(message,'e');
        }
    

        
        } catch (error) {
        // Handle errors during the fetch
        notify(error,'e');
        console.error('Fetch error:', error);
        }
        finally{
            document.getElementById('updatedet').style.display='none';
        }
    }

      }




      async function toggleOpenDelte() {
        const saveFileDiv1 = document.getElementById('savefile');
        if(saveFileDiv1.style.display === 'flex'){
            saveFileDiv1.style.display = 'none';
        }
        const saveFileDiv = document.getElementById('opendelfile');
        if (saveFileDiv.style.display === 'none' || saveFileDiv.style.display === ''){
          saveFileDiv.style.display = 'flex';
        } else {
          saveFileDiv.style.display = 'none';
        }



        let dataToServer={
            rollnumber : rollnumber
        }

        try {
            notify('Please wait','w');
            const response = await fetch(mainServerUrl+'getfilesdetals', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',

              },
              body: JSON.stringify(dataToServer),
            });
    
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
    
        const {message} = await response.json();
        if(message==='There is a problem in getting files details please try again later or check your internet connection'){
            notify(message,'e');

        }
        else{
            console.log(message);
            setallFiles(message.filenames);
             
        }
        //alert(message);
        
        //navigate('/');
        // Handle the data returned from the server
        } catch (error) {
        // Handle errors during the fetch
        notify(error,'e');
        console.error('Fetch error:', error);
        }


      }

      function rmhdiv(){
        document.getElementById('savefile').style.display = 'none';
        document.getElementById('opendelfile').style.display = 'none';
        document.getElementById('updatedet').style.display='none';
      }


      function newFile(){
        document.getElementById('savefile').style.display = 'none';
        document.getElementById('opendelfile').style.display = 'none';
        document.getElementById('updatedet').style.display='none';
        document.getElementById('centerbottom').value="";
        document.getElementById('topfilename').innerText="File name";
        fileName = document.getElementById('filename').value="";
        notify('New file','i');

      }

      function copyText(){
        document.getElementById('savefile').style.display = 'none';
        document.getElementById('opendelfile').style.display = 'none';
        document.getElementById('updatedet').style.display='none';
        const textarea = document.getElementById('centerbottom');
        textarea.select();
        textarea.setSelectionRange(0, 99999);
        document.execCommand('copy');
        notify('Text copied to clipboard','i');
      }

      function clearText(){
        document.getElementById('savefile').style.display = 'none';
        document.getElementById('opendelfile').style.display = 'none';
        document.getElementById('updatedet').style.display='none';
        document.getElementById('centerbottom').value="";
        notify('Text clearec','i');

      }

      let fileData;
      let fileName;


      async function saveFile(){
        document.getElementById('savefile').style.display = 'none';
        document.getElementById('opendelfile').style.display = 'none';
        document.getElementById('updatedet').style.display='none';
        fileName = document.getElementById('filename').value.trim();
        fileData = document.getElementById('centerbottom').value;
        if(rollnumber==='No roll number provided'){
            notify('Login to save files','w');
        }
        else{
        if(fileData.length===0){
            notify('File is empty','w');
        }
        else{
            if(fileName.length===0){
                notify('Enter file name','w');
            }
            else{

                notify('Pease wait','w');

                let dataToServer={
                    rollnumber : rollnumber,
                    filename : fileName,
                    filedata : fileData
                }

                
                try {
                    const response = await fetch(mainServerUrl+'savefile', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
        
                      },
                      body: JSON.stringify(dataToServer),
                    });
            
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
            
                const {message} = await response.json();
                if(message==='File saved'){
                    document.getElementById('topfilename').innerText=fileName;
                    document.getElementById('topfilename').innerText.slice(0, -2);
                    notify(message,'s');
                }

                else if(message==='File updated'){
                    document.getElementById('topfilename').innerText=fileName;
                    document.getElementById('topfilename').innerText.slice(0, -2);
                    notify(message,'s');
                }

                else{
                    notify(message,'e');
                }
                //alert(message);
                
                //navigate('/');
                // Handle the data returned from the server
                } catch (error) {
                // Handle errors during the fetch
                notify(error,'e');
                console.error('Fetch error:', error);
                }



            }
        }
    }

        
        
      }

      function filechanged(){
        if(document.getElementById('topfilename').innerText.includes(' *')){

        }
        else{
            document.getElementById('topfilename').innerText=document.getElementById('topfilename').innerText+' *';
        }
        
      }



      //Openning file
      async function mOpenFile(ind){
        document.getElementById('savefile').style.display = 'none';
        document.getElementById('opendelfile').style.display = 'none';
        document.getElementById('updatedet').style.display='none';
        fileName = document.getElementById('filename').value.trim();

                   try {
                    notify('please wait','w');

                    let dataToServer = {
                        rollnumber : rollnumber,
                        filename : allFiles[ind]
                    }
                    

                    const response = await fetch(mainServerUrl+'getfile', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
        
                      },
                      body: JSON.stringify(dataToServer),
                    });
            
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
            
                const {message} = await response.json();
                document.getElementById('topfilename').innerText=message.filename;
                document.getElementById('centerbottom').value=message.filedata;
                
                } catch (error) {
                // Handle errors during the fetch
                notify(error,'e');
                console.error('Fetch error:', error);
                }



            }


            //To delete files
            async function mDeleteFile(ind){

                try {
                    notify('please wait','w');

                    let dataToServer = {
                        rollnumber : rollnumber,
                        filename : allFiles[ind]
                    }
                    

                    const response = await fetch(mainServerUrl+'deletefile', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
        
                      },
                      body: JSON.stringify(dataToServer),
                    });
            
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
            
                const {message} = await response.json();
                if(message==='File deleted'){
                    notify(message,'s');
                    let rmfile = allFiles[ind];
                    let sfiles = allFiles.filter(item => item !== rmfile);
                    setallFiles(sfiles);
                    newFile();
                }
                
                } catch (error) {
                // Handle errors during the fetch
                notify(error,'e');
                console.error('Fetch error:', error);
                }

                
                

            }


            



    return(
        <>
            <div id="homemain">
            <ToastContainer 
                position="top-center"
                autoClose={1000}
                draggable
                
                />

                <div id="homeside">
                    <div id="sidetop">

                        <button className="opbtn" onClick={newFile}>New</button>
                        <button className="opbtn" onClick={toggleOpenDelte}>Open</button>
                        <button className="opbtn" onClick={toggleSaveFile}>Save</button>
                        <button className="opbtn" onClick={toggleOpenDelte}>Delete</button>
                        <button className="opbtn" onClick={copyText}>Copy text</button>
                        <button className="opbtn" onClick={clearText}>Clear text</button>

                    </div>

                    <div id="sidebottom">

                        <button class="logoutbtn">
                        
                        <div class="sign"><svg viewBox="0 0 512 512"><path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z"></path></svg></div>
                        
                        <div class="text" onClick={()=>navigate('/')}>
                            Logout
                        </div>
                        </button>  

                        <div id='profilepic' onClick={showup}>
                        </div>


                    </div>
                </div>

                <div id="homecenter">
                    <div id="centertop">
                        <span id='topfilename'>Filename</span>
                        <span>{rollnumber}</span>

                    </div>
                    <textarea name="textarea" id="centerbottom" placeholder='Enter your text' onClick={rmhdiv} onChange={filechanged}>
                    </textarea>
                    
                </div>
            </div>

            <div id='savefile'>
                <input className='filename' type="text" placeholder='filename' id='filename'/>
                <button className='sobtn' onClick={saveFile}>Save</button>
            </div>

            <div id="opendelfile">
                <span>Choose file</span>
                <ul>
                    {allFiles.map((file, index) => (
                    <li className='oplit' key={index}>{file} <button className='sobtn' onClick={()=>mOpenFile(index)}>Open</button> <button className='sobtn' onClick={()=>mDeleteFile(index)}>Delete</button> </li>
                    ))}
                </ul>
            </div>


            <div id="updatedet">
                <h2>Change password</h2>
                <input type="text" className='upipt' value={rollnumber}/>
                <input type="text" className='upipt' value={password}/>
                <input type="text" placeholder='New password' id='newpass' className='upipt'/>
                <button className="upipt" onClick={updatepassword}>Update</button>
            </div>

            
        </>
    );
}


export default Home;
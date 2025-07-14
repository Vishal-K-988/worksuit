'use client'

type Props = {
    URL : string
}

export const Pdfview  =(props : Props )  => {
   
    

    
    return (<>
    
    
          <iframe 
           className="w-full h-screen"// Full width, but a fixed large height
  frameBorder="0"
  title="PDF Document"
          src={props.URL || "" || null} ></iframe>
    </>)
}

export default Pdfview

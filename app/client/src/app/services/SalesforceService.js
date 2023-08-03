export const syncSalesforce = async (json_file, pdf_file) => {
    const { fetch } = window;
    const { freelancer_id, record_id } = JSON.parse(localStorage.getItem('salesforce'))
    
    const body = {
        data: {
            profile_pdf : await blobToBase64(pdf_file),
            profile_json : await blobToBase64(json_file),

        },
        meta: {
            freelancer_id,
            record_id
        }
    }

    const request = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    }

    await fetch(`/api/salesforcesync`, request);
    

}


function blobToBase64(blob) {
    return new Promise((resolve, _) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });
  }
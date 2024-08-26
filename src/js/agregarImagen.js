import { Dropzone } from 'dropzone';

Dropzone.options.imagen = {
    dictDefaultMessage: 'Haz click para cargar tus imagenes o suelta tu imagen aqui', 
    acceptedFiles: '.png,.jpg,.jpeg', 
    maxFilesize: 5,
    maxFiles: 3,
    parallelUploads: 3, 
    autoProcessQueue: false, 
    addRemoveLinks: true, 
    dictRemoveFile: 'Borrar imagen', 
    dictMaxFilesExceeded: 'El limite de archivos es 3', 
    paramName: 'imagen',
    init: function(){
        const dropzone = this
        const btnPrublicar = document.querySelector('#publicar')

        btnPrublicar.addEventListener('click', function(){
            dropzone.processQueue()
        })
        dropzone.on('queuecomplete', function(){
            if(dropzone.getActiveFiles().length == 0){
                window.location.href= '/admin' 
            }
        })
    }
} 
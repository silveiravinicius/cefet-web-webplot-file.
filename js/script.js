(function () {
	'use strict';

	// Check for the various File API support.
	if (window.File && window.FileReader && window.FileList && window.Blob)
		console.log('OK');
	else
		alert('The File APIs are not fully supported in this browser.');

	var reader, files;
	var dropZone = document.getElementById('dropZone'),
			progress = document.getElementById('progress'),
			progressBar = document.getElementById('progressBar'),
			outputTag = document.getElementById('output');

	/**
	 * Event handlers for ReadFile.
	 */

	// Stop reading files.
	function abortRead() {
		reader.abort();
	}

	// FileReader abort Handler
	function abortHandler(e) {
		alert('File read Canceled');
	}

	// FileReader Error Handler
	function errorHandler (e) {
		switch(e.target.error.code) {
			case e.target.error.NOT_FOUND_ERR:
				alert('File Not Found!');
				break;
			case e.target.error.NOT_READABLE_ERR:
				alert('File is not readable');
				break;
			case e.target.error.ABORT_ERR:
				break; // noop
			default:
				alert('An error occurred reading this file.');
		}
	}

	// Display the progress of FileReading.
	function progressHandler(e) {
		if (e.lengthComputable) {
			var loaded = Math.round((e.loaded / e.total) * 100);
			var zeros = '';
			
			// Percent Loaded in string
			if (loaded >= 0 && loaded < 10) zeros = '00';
			else if (loaded < 100) zeros = '0';

			// Display progress in 3-digit and increase the bar length.
			progress.textContent = zeros + loaded.toString();
			progressBar.style.width = loaded + '%';

		}
	}

	// Event after loading a file completed (Append thumbnail.)
	function loadHandler(theFile) {

		return function(e) {
			var newFile = document.createElement('div');
			var picture = document.createElement('picture');
			var img = document.createElement('div');
			img.style.backgroundImage = 'url(' + e.target.result + ')';
			img.title = escape(theFile.name);
			img.className = 'thumb';

			picture.appendChild(img);
			newFile.appendChild(picture);
			newFile.className = 'file';

			outputTag.insertBefore(newFile, null);
		}
	}

	// Main function for ReadFile and appending thumbnails.
	function appendThumbnail(f) {
		reader = new FileReader();
		reader.onerror = errorHandler;
		reader.onabort = abortHandler;
		reader.onprogress = progressHandler;
		reader.onload = loadHandler(f);
		reader.readAsDataURL(f);
	}

	/**
	 * Main Event Handler to deal with
	 * the whole drop & upload process.
	 */

	function handleFileSelect(e) {
		e.stopPropagation();
		e.preventDefault();

		dropZone.classList.remove('dragover');
		progress.textContent = '000';
		progressBar.style.width = '0%';

		files = e.dataTransfer.files; // FileList object.
		
		// Go through each file.
		for (var i=0, f; f=files[i]; i++) {

      let elementoDescricao = document.createElement("div");

      elementoDescricao.innerHTML="<b class=\"texto\"> Nome: </b>"+files[i].name+
			"<br>"+"<b class=\"texto\">Ultima modificação: </b>"+new Date(files[i].lastModified).toISOString()+
			"<br><b class=\"texto\"> Tamanho: </b>"+files[i].size+"b"+
			"<br><a href="+window.URL.createObjectURL(f)+" target=\"_blank\">Abrir arquivo</a> (Sujeito a limitações do navegador)";

      document.querySelector('#descricoes').appendChild(elementoDescricao);

			// Only process image files.
			if ( !f.type.match('image.*') ) continue;
			appendThumbnail(f);

		} // END for

	} // END handleFileSelect

	/**
	 * functions associating "drag" event.
	 */
	function handleDragEnter (e) {
		e.stopPropagation();
		e.preventDefault();
		this.classList.add('dragover');
	}
	function handleDragLeave (e) {
		e.stopPropagation();
		e.preventDefault();
		this.classList.remove('dragover');
	}
	function handleDragOver (e) {
		e.stopPropagation();
		e.preventDefault();
		e.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
	}

	/**
	 * Setup the event listeners.
	 */
	dropZone.addEventListener('dragenter', handleDragEnter, false)
	dropZone.addEventListener('dragleave', handleDragLeave, false)
	dropZone.addEventListener('dragover', handleDragOver, false);
	dropZone.addEventListener('drop', handleFileSelect, false);
})();
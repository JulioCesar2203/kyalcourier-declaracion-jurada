document.addEventListener("DOMContentLoaded", () => {
  const btnSiguiente = document.getElementById("btnSiguiente");
  const btnAtras = document.getElementById("btnAtras");
  const btnGenerar = document.getElementById("btnGenerar");
  const btnRecargar = document.getElementById("btnRecargar");
  const datosForm = document.getElementById("datosForm");
  const productosForm = document.getElementById("productosForm");
  const dniInput = document.getElementById("dni");
  const nombreInput = document.getElementById("nombre");
  const distritoInput = document.getElementById("distrito");
  const direccionInput = document.getElementById("direccion");
  const tabDatosEl = document.getElementById("datos-tab");
  const tabProductosEl = document.getElementById("productos-tab");
  const tabDatos = new bootstrap.Tab(tabDatosEl);
  const tabProductos = new bootstrap.Tab(tabProductosEl);
  const listaProductos = document.getElementById("listaProductos");
  const totalGeneralDisplay = document.getElementById("totalGeneralDisplay");
  const btnAgregarProducto = document.getElementById("btnAgregarProducto");
  const mainFormContainer = document.getElementById("mainFormContainer");
  const successContainer = document.getElementById("successContainer");

  dniInput.addEventListener("input", function () {
    this.value = this.value.replace(/[^0-9]/g, "");
  });

  nombreInput.addEventListener("input", function () {
    this.value = this.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, "");
  });

  distritoInput.addEventListener("input", function () {
    this.value = this.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s\-]/g, "");
  });

  direccionInput.addEventListener("input", function () {
    this.value = this.value.replace(/[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s.,#\-\/]/g, "");
  });

  btnSiguiente.addEventListener("click", () => {
    if (!datosForm.checkValidity()) {
      datosForm.classList.add("was-validated");
      Swal.fire({
        icon: "warning",
        title: "Faltan datos",
        text: "Por favor, complete todos los campos obligatorios del consignatario.",
        confirmButtonColor: "#244bbb",
        confirmButtonText: "Entendido",
      });
    } else {
      tabProductosEl.removeAttribute("disabled");
      tabProductos.show();
    }
  });

  btnAtras.addEventListener("click", () => {
    tabDatos.show();
  });

  btnRecargar.addEventListener("click", () => {
    location.reload();
  });

  function calcularTotalGeneral() {
    let total = 0;
    document.querySelectorAll(".input-valor-total").forEach((input) => {
      total += parseFloat(input.value) || 0;
    });
    totalGeneralDisplay.textContent = total.toFixed(2);
  }

  listaProductos.addEventListener("input", (e) => {
    if (e.target.classList.contains("input-pais") || e.target.classList.contains("input-color")) {
      e.target.value = e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, "");
    } else if (e.target.classList.contains("input-descripcion")) {
      e.target.value = e.target.value.replace(/[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s.,\-%]/g, "");
    } else if (e.target.classList.contains("input-marca")) {
      e.target.value = e.target.value.replace(/[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s&\-]/g, "");
    } else if (e.target.classList.contains("input-talla")) {
      e.target.value = e.target.value.replace(/[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s.\-]/g, "").toUpperCase();
    }

    if (e.target.classList.contains("input-unidades") || e.target.classList.contains("input-valor-unidad")) {
      const card = e.target.closest(".producto-item");
      const unidades = parseFloat(card.querySelector(".input-unidades").value) || 0;
      const precio = parseFloat(card.querySelector(".input-valor-unidad").value) || 0;
      card.querySelector(".input-valor-total").value = (unidades * precio).toFixed(2);
      calcularTotalGeneral();
    }
  });

  function actualizarNumeracion() {
    document.querySelectorAll(".producto-item").forEach((item, index) => {
      item.querySelector(".titulo-producto").textContent = `Producto ${index + 1}`;
    });
  }

  btnAgregarProducto.addEventListener("click", () => {
    const cantidadProductos = document.querySelectorAll(".producto-item").length;

    if (cantidadProductos >= 20) {
      Swal.fire({
        icon: "warning",
        title: "Límite alcanzado",
        text: "Por políticas de la declaración, solo se permite un máximo de 20 productos.",
        confirmButtonColor: "#244bbb",
        confirmButtonText: "Entendido",
      });
      return;
    }

    if (!productosForm.checkValidity()) {
      productosForm.classList.add("was-validated");
      Swal.fire({
        icon: "warning",
        title: "Complete el producto actual",
        text: "Por favor, llene todos los campos obligatorios antes de añadir uno nuevo.",
        confirmButtonColor: "#244bbb",
        confirmButtonText: "Entendido",
      });
      return;
    }

    productosForm.classList.remove("was-validated");
    const productos = document.querySelectorAll(".producto-item");
    const nuevoProducto = productos[0].cloneNode(true);
    nuevoProducto.querySelectorAll("input").forEach((input) => (input.value = ""));
    listaProductos.appendChild(nuevoProducto);
    actualizarNumeracion();
    calcularTotalGeneral();
  });

  listaProductos.addEventListener("click", (e) => {
    if (e.target.classList.contains("btn-eliminar-producto")) {
      if (document.querySelectorAll(".producto-item").length > 1) {
        e.target.closest(".producto-item").remove();
        actualizarNumeracion();
        calcularTotalGeneral();
      } else {
        Swal.fire({
          icon: "error",
          title: "No se puede eliminar",
          text: "Debe haber al menos un producto en la lista.",
          confirmButtonColor: "#244bbb",
        });
      }
    }
  });

  btnGenerar.addEventListener("click", () => {
    if (!productosForm.checkValidity()) {
      productosForm.classList.add("was-validated");
      Swal.fire({
        icon: "warning",
        title: "Faltan datos",
        text: "Por favor, complete todos los campos obligatorios de los productos.",
        confirmButtonColor: "#244bbb",
        confirmButtonText: "Entendido",
      });
    } else {
      generarPDFNativo();
    }
  });

  function generarPDFNativo() {
    Swal.fire({
      title: 'Generando PDF...',
      text: 'Calculando saltos de página y dibujando tabla...',
      allowOutsideClick: false,
      didOpen: () => { Swal.showLoading(); }
    });

    const nombre = nombreInput.value;
    const dni = dniInput.value;
    const distrito = distritoInput.value;
    const direccion = direccionInput.value;

    const meses = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
    const fechaActual = new Date();
    const fechaTexto = `${fechaActual.getDate()} de ${meses[fechaActual.getMonth()]} del ${fechaActual.getFullYear()}`;
    const fechaArchivo = `${fechaActual.getFullYear()}-${String(fechaActual.getMonth() + 1).padStart(2, "0")}-${String(fechaActual.getDate()).padStart(2, "0")}`;

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.setFont("times", "bold");
    doc.setFontSize(13);
    doc.text("DECLARACIÓN JURADA DE VALOR", 105, 25, { align: "center" });

    doc.setFontSize(11);
    doc.setFont("times", "normal");
    doc.text("Señores", 15, 40);
    doc.setFont("times", "bold");
    doc.text("SUNAT (SUPERINTENDENCIA NACIONAL DE ADUANAS Y DE ADMINISTRACIÓN TRIBUTARIA)", 15, 47);
    doc.text("INTENDENCIA DE LA ADUANA AEREA DEL CALLAO", 15, 54);

    doc.setFont("times", "normal");
    const parrafo1 = `Yo, ${nombre}, identificado con DNI ${dni}, domiciliado en ${direccion}, distrito de ${distrito}, provincia de Lima, departamento de Lima, en mérito a la Ley del Procedimiento Administrativo General, Ley N° 27444, declaro el valor FOB estimado de la(s) mercancía(s), así como los datos siguientes:`;

    const lineasParrafo1 = doc.splitTextToSize(parrafo1, 180);
    doc.text(lineasParrafo1, 15, 65);

    let posicionY_Tabla = 65 + (lineasParrafo1.length * 6) + 5;

    const bodyDatos = [];
    let totalSuma = 0;

    document.querySelectorAll(".producto-item").forEach((item, index) => {
      const desc = item.querySelector(".input-descripcion").value;
      const pais = item.querySelector(".input-pais").value;
      const marca = item.querySelector(".input-marca").value;
      const talla = item.querySelector(".input-talla").value;
      const color = item.querySelector(".input-color").value;
      const unid = item.querySelector(".input-unidades").value;
      const vUnit = item.querySelector(".input-valor-unidad").value;
      const vTot = item.querySelector(".input-valor-total").value;

      totalSuma += parseFloat(vTot);

      bodyDatos.push([
        index + 1, desc, pais, marca, talla, color, unid, parseFloat(vUnit).toFixed(2), parseFloat(vTot).toFixed(2)
      ]);
    });

    bodyDatos.push([
      { content: 'TOTAL:', colSpan: 8, styles: { halign: 'right', fontStyle: 'bold' } },
      { content: totalSuma.toFixed(2), styles: { halign: 'center', fontStyle: 'bold' } }
    ]);

    doc.autoTable({
      startY: posicionY_Tabla,
      head: [['N° Serie', 'Descripción', 'País Origen', 'Marca', 'Talla', 'Color', 'Unid.', 'Valor Unit.', 'Valor Total']],
      body: bodyDatos,
      theme: 'grid',
      styles: { font: 'times', fontSize: 9, halign: 'center', textColor: [0, 0, 0], lineColor: [0, 0, 0], lineWidth: 0.1 },
      headStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold' },
      margin: { top: 20, right: 15, bottom: 20, left: 15 },
    });

    let finalY = doc.lastAutoTable.finalY + 15;

    if (finalY > 240) {
      doc.addPage();
      finalY = 25;
    }

    const parrafo2 = "Declaro bajo Juramento que los presentes datos obedecen a la verdad, sometiéndome a las sanciones administrativas, civiles y penales que corresponden en caso de falsedad de los mismos.";
    const lineasParrafo2 = doc.splitTextToSize(parrafo2, 180);
    doc.text(lineasParrafo2, 15, finalY);

    finalY += (lineasParrafo2.length * 6) + 15;

    doc.text(`Lima, ${fechaTexto}`, 195, finalY, { align: "right" });

    finalY += 35;

    doc.line(100, finalY, 195, finalY);
    doc.setFont("times", "bold");
    doc.text(nombre, 147.5, finalY + 6, { align: "center" });
    doc.setFont("times", "normal");
    doc.text(`DNI ${dni}`, 147.5, finalY + 12, { align: "center" });

    doc.save(`kyalcourier-declaracion-jurada_${fechaArchivo}.pdf`);

    Swal.close();
    mainFormContainer.classList.add("d-none");
    successContainer.classList.remove("d-none");
  }
});

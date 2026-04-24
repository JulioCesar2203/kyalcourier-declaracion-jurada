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
    if (
      e.target.classList.contains("input-pais") ||
      e.target.classList.contains("input-color")
    ) {
      e.target.value = e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, "");
    } else if (e.target.classList.contains("input-descripcion")) {
      e.target.value = e.target.value.replace(
        /[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s.,\-%]/g,
        "",
      );
    } else if (e.target.classList.contains("input-marca")) {
      e.target.value = e.target.value.replace(
        /[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s&\-]/g,
        "",
      );
    } else if (e.target.classList.contains("input-talla")) {
      e.target.value = e.target.value
        .replace(/[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s.\-]/g, "")
        .toUpperCase();
    }

    if (
      e.target.classList.contains("input-unidades") ||
      e.target.classList.contains("input-valor-unidad")
    ) {
      const card = e.target.closest(".producto-item");
      const unidades =
        parseFloat(card.querySelector(".input-unidades").value) || 0;
      const precio =
        parseFloat(card.querySelector(".input-valor-unidad").value) || 0;
      card.querySelector(".input-valor-total").value = (
        unidades * precio
      ).toFixed(2);
      calcularTotalGeneral();
    }
  });

  function actualizarNumeracion() {
    document.querySelectorAll(".producto-item").forEach((item, index) => {
      item.querySelector(".titulo-producto").textContent =
        `Producto ${index + 1}`;
    });
  }

  btnAgregarProducto.addEventListener("click", () => {
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
    nuevoProducto
      .querySelectorAll("input")
      .forEach((input) => (input.value = ""));
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
      generarWord();
    }
  });

  function generarWord() {
    const nombre = nombreInput.value;
    const dni = dniInput.value;
    const distrito = distritoInput.value;
    const direccion = direccionInput.value;

    const meses = [
      "enero",
      "febrero",
      "marzo",
      "abril",
      "mayo",
      "junio",
      "julio",
      "agosto",
      "septiembre",
      "octubre",
      "noviembre",
      "diciembre",
    ];
    const fechaActual = new Date();
    const fechaTexto = `${fechaActual.getDate()} de ${meses[fechaActual.getMonth()]} del ${fechaActual.getFullYear()}`;
    const fechaArchivo = `${fechaActual.getFullYear()}-${String(fechaActual.getMonth() + 1).padStart(2, "0")}-${String(fechaActual.getDate()).padStart(2, "0")}`;

    let filasTabla = "";
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

      filasTabla += `
        <tr>
          <td style="border: 1px solid black; text-align: center; padding: 4px;">${index + 1}</td>
          <td style="border: 1px solid black; text-align: center; padding: 4px;">${desc}</td>
          <td style="border: 1px solid black; text-align: center; padding: 4px;">${pais}</td>
          <td style="border: 1px solid black; text-align: center; padding: 4px;">${marca}</td>
          <td style="border: 1px solid black; text-align: center; padding: 4px;">${talla}</td>
          <td style="border: 1px solid black; text-align: center; padding: 4px;">${color}</td>
          <td style="border: 1px solid black; text-align: center; padding: 4px;">${unid}</td>
          <td style="border: 1px solid black; text-align: center; padding: 4px;">${parseFloat(vUnit).toFixed(2)}</td>
          <td style="border: 1px solid black; text-align: center; padding: 4px;">${parseFloat(vTot).toFixed(2)}</td>
        </tr>
      `;
    });

    const htmlTemplate = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head><meta charset='utf-8'><title>Declaración Jurada</title></head>
      <body style="font-family: 'Times New Roman', Times, serif; font-size: 11pt;">
        <h3 style="text-align: center; font-weight: bold; margin-bottom: 20px;">DECLARACIÓN JURADA DE VALOR</h3>
        <p style="margin-bottom: 5px;">Señores<br>
        <b>SUNAT (SUPERINTENDENCIA NACIONAL DE ADUANAS Y DE ADMINISTRACIÓN TRIBUTARIA)</b><br>
        <b>INTENDENCIA DE LA ADUANA AEREA DEL CALLAO</b></p>
        <p style="text-align: justify; margin-bottom: 20px;">
        Yo, <b>${nombre}</b>, identificado con DNI <b>${dni}</b>, domiciliado en <b>${direccion}</b>, distrito de <b>${distrito}</b>, provincia de Lima, departamento de Lima, en mérito a la Ley del Procedimiento Administrativo General, Ley N° 27444, declaro el valor FOB estimado de la(s) mercancía(s), así como los datos siguientes:
        </p>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 9pt;">
          <thead>
            <tr>
              <th style="border: 1px solid black; padding: 4px;">N° de Serie</th>
              <th style="border: 1px solid black; padding: 4px;">Descripción</th>
              <th style="border: 1px solid black; padding: 4px;">País de Origen</th>
              <th style="border: 1px solid black; padding: 4px;">Marca</th>
              <th style="border: 1px solid black; padding: 4px;">Talla</th>
              <th style="border: 1px solid black; padding: 4px;">Color</th>
              <th style="border: 1px solid black; padding: 4px;">Unid.</th>
              <th style="border: 1px solid black; padding: 4px;">Valor Unit.</th>
              <th style="border: 1px solid black; padding: 4px;">Valor Total</th>
            </tr>
          </thead>
          <tbody>
            ${filasTabla}
            <tr>
              <td colspan="8" style="border: 1px solid black; text-align: right; font-weight: bold; padding: 4px;">TOTAL:</td>
              <td style="border: 1px solid black; text-align: center; padding: 4px;">${totalSuma.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
        <p style="text-align: justify; margin-bottom: 30px;">
        Declaro bajo Juramento que los presentes datos obedecen a la verdad, sometiéndome a las sanciones administrativas, civiles y penales que corresponden en caso de falsedad de los mismos.
        </p>
        <p style="text-align: right; margin-bottom: 60px;">
        Lima, ${fechaTexto}
        </p>
        <table style="width: 100%; border: none;">
          <tr>
            <td style="width: 60%;"></td>
            <td style="width: 40%; text-align: center; border-top: 1px solid black;">
              <b>${nombre}</b><br>DNI ${dni}
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    const blob = new Blob(["\ufeff", htmlTemplate], {
      type: "application/msword",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `kyalcourier-declaracion-jurada_${fechaArchivo}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    mainFormContainer.classList.add("d-none");
    successContainer.classList.remove("d-none");
  }
});

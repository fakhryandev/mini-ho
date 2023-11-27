const registerForm = document.getElementById("requestForm");

registerForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const nomor = document.getElementById("nomor").value;
  const nik = document.getElementById("nik").value;
  const nama = document.getElementById("nama").value;
  const alamat = document.getElementById("alamat").value;
  const telepon = document.getElementById("telepon").value;
  const kota = document.getElementById("kota").value;
  const noka = document.getElementById("noka").value;
  const nosin = document.getElementById("nosin").value;
  const type = document.getElementById("type").value;
  const tahun = document.getElementById("tahun").value;
  const parts = document.getElementById("parts").value;
  const ktp = document.getElementById("ktp");
  const stnk = document.getElementById("stnk");

  const data = {
    nomor,
    nik,
    nama,
    alamat,
    telepon,
    kota,
    noka,
    nosin,
    type,
    tahun,
    parts,
    ktp,
    stnk,
  };

  validateRequest(data);
});

function findDuplicates(parts) {
  const valueCount = {};
  const duplicates = [];

  for (const value of parts) {
    if (valueCount[value] === undefined) {
      valueCount[value] = 1;
    } else {
      duplicates.push(value);
      valueCount[value]++;
    }
  }

  return duplicates;
}

function validateFile(fileInput, fileType) {
  const file = fileInput.files[0];

  const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
  if (!allowedTypes.includes(file.type)) {
    console.log("Hanya file dengan tipe JPG, JPEG, atau PNG yang diizinkan.");
  }

  const maxSizeMB = 10;
  const maxSizeBytes = maxSizeMB * 1024 * 1024;

  if (file.size > maxSizeBytes) {
    console.log(`Ukuran file terlalu besar. Maksimal ${maxSizeMB} MB.`);
  }
}

async function validateRequest(data) {
  const { parts } = data;
  const partsSplitted = parts
    .split(";")
    .map((item) => item.trim())
    .filter((item) => item != "");

  const duplicateValues = findDuplicates(partsSplitted);

  if (duplicateValues.length) {
    console.log(`Ada part number yang duplikat ${duplicateValues.join(", ")}`);
  } else {
    const { error, message } = await addRequest(data);
    const swalConfig = {
      icon: "success",
      text: "Berhasil menambah data.",
    };
    if (error) {
      swalConfig.icon = "error";
      swalConfig.text = "Gagal menambah data.";
      console.error(message);
    }

    Swal.fire(swalConfig);
  }
}

async function addRequest(data) {
  const requestURL = "api/request";
  const formData = new FormData();

  const {
    nomor,
    nik,
    nama,
    alamat,
    telepon,
    kota,
    noka,
    nosin,
    type,
    tahun,
    parts,
    ktp,
    stnk,
  } = data;

  formData.append("nomor", nomor);
  formData.append("nik", nik);
  formData.append("nama", nama);
  formData.append("alamat", alamat);
  formData.append("telepon", telepon);
  formData.append("kota", kota);
  formData.append("noka", noka);
  formData.append("nosin", nosin);
  formData.append("type", type);
  formData.append("tahun", tahun);
  formData.append("parts", parts);
  formData.append("ktp", ktp.files[0]);
  formData.append("stnk", stnk.files[0]);

  const response = await fetch(requestURL, {
    method: "POST",
    body: formData,
  });

  const result = await response.json();
  return result;
}

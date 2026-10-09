const express = require("express");
const swaggerUi = require("swagger-ui-express");
const app = express();
const PORT = 3000;
app.use(express.json());

const swaggerDocument = {
  openapi: "3.0.3",
  info: { title: "API Data Mahasiswa", version: "1.0.0" },
  servers: [{ url: "http://localhost:3000" }],
  components: {
    schemas: {
      MahasiswaInput: {
        type: "object",
        required: ["nama", "jurusan"],
        properties: {
          nama: { type: "string", example: "Budi" },
          jurusan: { type: "string", example: "Sistem Informasi" },
        },
      },
      Mahasiswa: {
        type: "object",
        properties: {
          id: { type: "integer", example: 3 },
          nama: { type: "string", example: "Budi" },
          jurusan: { type: "string", example: "Sistem Informasi" },
        },
      },
    },
  },
  paths: {
    "/mahasiswa": {
      get: {
        summary: "Lihat semua mahasiswa",
        responses: { 200: { description: "Daftar mahasiswa" } },
      },
      post: {
        summary: "Tambah mahasiswa",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/MahasiswaInput" },
            },
          },
        },
        responses: {
          201: { description: "Data berhasil dibuat" },
          400: { description: "Input tidak valid" },
        },
      },
    },
    "/mahasiswa/{id}": {
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: { type: "integer" },
        },
      ],
      get: {
        summary: "Detail mahasiswa",
        responses: {
          200: { description: "Detail mahasiswa" },
          404: { description: "Data tidak ditemukan" },
        },
      },
      put: {
        summary: "Ubah mahasiswa",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/MahasiswaInput" },
            },
          },
        },
        responses: {
          200: { description: "Data diperbarui" },
          400: { description: "Input tidak valid" },
          404: { description: "Data tidak ditemukan" },
        },
      },
      delete: {
        summary: "Hapus mahasiswa",
        responses: {
          204: { description: "Data dihapus" },
          404: { description: "Data tidak ditemukan" },
        },
      },
    },
  },
};
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(PORT, () => {
  console.log(`API berjalan di http://localhost:${PORT}`);
});

let mahasiswa = [
  { id: 1, nama: "Andi", jurusan: "Sistem Informasi" },
  { id: 2, nama: "Siti", jurusan: "Teknik Informatika" },
];
let idBerikutnya = 3;

app.get("/mahasiswa", (req, res) => {
  res.json(mahasiswa);
});

app.get("/mahasiswa/:id", (req, res) => {
  const id = Number(req.params.id);
  const data = mahasiswa.find((item) => item.id === id);
  if (!data) {
    return res.status(404).json({ pesan: "Mahasiswa tidak ditemukan" });
  }
  res.json(data);
});

app.post("/mahasiswa", (req, res) => {
  const { nama, jurusan } = req.body || {};
  if (
    typeof nama !== "string" ||
    !nama.trim() ||
    typeof jurusan !== "string" ||
    !jurusan.trim()
  ) {
    return res.status(400).json({ pesan: "Nama dan jurusan wajib diisi" });
  }
  const dataBaru = {
    id: idBerikutnya++,
    nama: nama.trim(),
    jurusan: jurusan.trim(),
  };
  mahasiswa.push(dataBaru);
  res.status(201).json({ pesan: "Mahasiswa ditambahkan", data: dataBaru });
});

app.put("/mahasiswa/:id", (req, res) => {
  const id = Number(req.params.id);
  const data = mahasiswa.find((item) => item.id === id);
  if (!data) {
    return res.status(404).json({ pesan: "Mahasiswa tidak ditemukan" });
  }
  const { nama, jurusan } = req.body || {};
  if (
    typeof nama !== "string" ||
    !nama.trim() ||
    typeof jurusan !== "string" ||
    !jurusan.trim()
  ) {
    return res.status(400).json({ pesan: "Nama dan jurusan wajib diisi" });
  }
  data.nama = nama.trim();
  data.jurusan = jurusan.trim();
  res.json({ pesan: "Mahasiswa diperbarui", data });
});

app.delete("/mahasiswa/:id", (req, res) => {
  const id = Number(req.params.id);
  const index = mahasiswa.findIndex((item) => item.id === id);
  if (index === -1) {
    return res.status(404).json({ pesan: "Mahasiswa tidak ditemukan" });
  }
  mahasiswa.splice(index, 1);
  res.status(204).send();
});

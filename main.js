var V, teta, sudut, T; // Deklarasi Variable, V = Kecepatan, teta = Sudut, T = Waktu yang ditempuh
var g = 9.8; // percepatan gravitasi

var totalPercobaan = 1; // Variable untuk menghitng jumlah percobaam, dimulai dari 1

var canvas; // mendeklarasikan variable canvas, nanti dipake buat canvas

var framePeriod = 30; // Jumlah Frame per detik untuk simulasij

var canvasWidth = 600; // ngambil lebar canvas dari tag html diatas dengan id Graph
var canvasHeight = 300; // mengambil tinggi canvas dari tag html diatas dengan id Graph

var width = 250; // ini nilai default pada graph nanti, defaultnya 250 meter panjang(cerita simulasinya)
var height = 200; // ini nilai default pada graph nanti, defaultnya 200 meter tinggi (cerita simulasinya

var widthMToPixels = 0; //deklarasi buat ngerubah width 250 meter (nilai tergantung data juga) dirubah ke pixel, soalnya dipake di canvas
var heightMToPixels = 0; // sama kayak diatas penjelasannya

// Deklarasi untuk simulasi sesuai dengan waktunya (realtime)
var velocity_x;
var velocity_y;

$(document).ready(function(){

  $("input[name=submit]").click(function(){ // ini menjelaskan kalo ada input dengan attribut yang name = submit, maka lakukan perintah didalamnya

    // Mengambil data kecepatan awal dan sudut pelemparannya dari inputan
    V = $("input[name=v]").val();
    teta = $("input[name=teta]").val();
    sudut = teta;
    // untuk merubah nama title simulasi yang ada pada atas canvas, menjadi sesuai dengan total Percobaan nya
    $('#title-simulasi').text('Simulasi Ke -' + totalPercobaan);

    //Derajat dirubah datanya ke radians, untuk dikalkuasikan pada saat penggunaan sin cos
    teta = derajatToRadians(teta);


    //  Memasuki Tahap Rumus
    var Vx = VsumbuX(V, teta); // Mengetahui kecepatan x
    var Vy = VsumbuY(V, teta); // Mengetahui kecepatan y
    var Tp = waktuPuncak(V, teta, g); // Mengetahui Waktu (detik) dari awal hingga ke titik tertinggi
    var T = 2 * Tp; // Total waktu dari awal hinggal jatuh/selesai

    var Hmaks = ketinggianMaksimum(V, teta, g); // Menghitung Ketinggian Maksimum
    var Xmaks = jarakXMaksimum(V, teta, g); // Menghitung jarakTempuh

    var x = jarakTempuhX(T); // Jarak Tempuh X
    var y = jarakTempuhY(T); // Jarak Tempuh Y





    // Variable ini berisi html untuk menampilkan hasil dalam bentuk Card Bootstrap
    // Number((variable).toFixed(int)) buat motong nilai digit float sesuai dengan parameter int
    var hasil = '<div class="card my-2 col-9">' +
                 '<div class="card-body">' +
                   '<h5 class="card-title"> Percobaan Ke - '+ totalPercobaan++ +'</h5>' +
                      "<li> t (waktu yang ditempuh) = " + Number((T).toFixed(3)) + " Detik</li>" +
                      "<li> tp (waktu yang ditempuh sampai puncak) = " + Number((Tp).toFixed(3)) + " Detik</li>" +
                      "<li> Kecepatan awal x = " + Number((Vx).toFixed(3)) + " m/s</li>" +
                      "<li> Kecepatan awal y = " + Number((Vy).toFixed(3)) + " m/s</li>" +
                      "<li> Kecepatan = " + V + " m/s</li>" +
                      "<li> Sudut = "+ sudut +"&#176;</li>"+
                      "<li> Waktu Puncak di titik 0 = " + Number((Tp).toFixed(3)) + " Detik</li>" +
                      "<li> Ketinggian Maksimum = " + Number((Hmaks).toFixed(3)) + " Meter</li>" +
                      "<li> Jarak Maksimum = " + Number((Xmaks).toFixed(3)) + " Meter</li>" +
                "</div>"+
               "</div>";
    $('#hasil').append(hasil); // Variable hasil di append / dipasang ke div yang ber id hasil



    // Pembuatan canvas untuk simulasi
    canvas = document.getElementById('graph'); // Menujuk canvas yang ber id graph
    if (canvas.getContext) {
        var ctx = canvas.getContext('2d');

        // Clear the canvas
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);

        //if ini menjelaskan data width sama height defaultnya 200 sama 150 m.
        // jika kondisi dimana hasil dari gerak peluru panjangnya melebihi 150 m, maka canvas diperlebar ukurannya
        if(Xmaks > width || Hmaks > height){
          width = Xmaks * 1.25;
          height = Xmaks * 1.25;
        }

        //Heigh dan Width dalam bentuk meter dirubah ke pixel, untuk menyesuaikan dengan canvas
        widthMToPixels = canvasWidth / width;
        heightMToPixels = canvasHeight / height;

        // Variable posisi x dan y dengan menggunakan parameter waktu saat y di puncak
        max_x = jarakTempuhX(Tp);
        max_y = jarakTempuhY(Tp);

        //Fungsi untuk mengambbar simulasi
        function draw(time, animate) {
            //Menyederhanakan Digit float dan di tampilkan di data simulasi (realtime)
            var x_pos = Number((jarakTempuhX(time)).toFixed(3));
            var y_pos = Number((jarakTempuhY(time)).toFixed(3));
            $('#time').val(time);
            $('#xpos').text(x_pos);
            $('#ypos').text(y_pos);

            //menghitung data kecepatan x, y dan kecepatan utama, sudut di detik sekarang/sesuai dengan variable time
            var v_x = velocity_x();
            var v_y = velocity_y(time);
            var speed = Math.sqrt(v_x*v_x + v_y*v_y);
            var angle = Math.atan(v_y / v_x) * 180 / Math.PI;

            // Menyederhanakan angka dibelakang koma menjadi 4 digit
            speed = Number((speed).toFixed(4));
            angle = Number((angle).toFixed(4));
            v_x = Number((v_x).toFixed(4));
            v_y = Number((v_y).toFixed(4))

            //speed dan sudut simulasi ditampilkan
            $('#speed').text(speed);
            $('#instantangle').text(angle);
            $('#v_x').text(v_x);
            $('#v_y').text(v_y);

            ctx.clearRect(0, 0, canvasWidth, canvasHeight);
            // Set drawing colours
            ctx.fillStyle = "rgb(0,0,200)";
            ctx.strokeStyle = "rgb(200,0,0)";

            // Ngegamnbar garis simulasi
            ctx.beginPath();
            ctx.moveTo(0, canvasHeight);
            ctx.quadraticCurveTo(max_x * widthMToPixels,
                                 canvasHeight - 2 * max_y * heightMToPixels,
                                 Xmaks * widthMToPixels,
                                 canvasHeight);
            ctx.stroke();

            // Gambar posisi sekarang (bola) untuk simulasinya
            x = jarakTempuhX(time) * widthMToPixels;
            y = canvasHeight - (jarakTempuhY(time) * heightMToPixels);
            xv = velocity_x() * widthMToPixels;
            yv = velocity_y(time) * heightMToPixels;

            // Gambar bolanya
            ctx.beginPath();
            ctx.moveTo(x * widthMToPixels, canvasHeight - (y * heightMToPixels));
            ctx.arc(x, y, 5, 0, Math.PI * 2, true);
            ctx.closePath;
            ctx.fill();

            // Incrementer Looping simulasi
            if(time != T){
              time += framePeriod / 1000;
            }

            // Jika waktu simulasi belum selesai, maka panggil fungsi gambar lagi, untuk melanjutkan simulasi
            if ((time < T + framePeriod*0.001) && animate){
              if(y > 0){
                setTimeout(function() { draw(time, true); }, framePeriod);
              }else{
                return;
              }
            }else if(y_pos < 0){
              draw(T, true);
            }
        }

        // Panggil fungsi draw (reqursive hingga waktu tertentu) untuk membuat simulasinya
        draw(0, true);

        $('#go').click(function() { // jika tombol go ditekan,  maka akan mengambil data gerak peluru sesuai dengan waktu nya
            draw($('#time').val(), false);
        });

        $('#replay').click(function(){ // me-replay simulasi
          draw(0, true);
        });

    }
  });


  function derajatToRadians(teta){ // Fungsi untuk merubah nilai derajat ke radians yang akan digunakan pada sin dan cos
    return teta * (Math.PI / 180);
  }

  function VsumbuX(V, teta){ // Menghitung nilai kecepatan pada kordinat X
    return V * Math.cos(teta)
  }

  function VsumbuY(V, teta){ // Fungsi Menghitung nilai kecepatan pada sumbu y
    return V * Math.sin(teta);
  }

  function jarakTempuhX(T){ // Fungsi Menghitung jarak tempuh X pada gerak peluru pada waktu tertentu
    return V * T * Math.cos(teta);
  }

  function jarakTempuhY(T){ // Fungsi menghitung jarak tempuh Y pada gerak peluru pada waktu tertentu
    return (V * T * Math.sin(teta)) - (0.5 * g * Math.pow(T,2));
  }

  function waktuPuncak(V, teta, g){ // Fungsi ini rumus buat ngitung waktu bola ada di puncak Tp
    return (V * Math.sin(teta)) / g;
  }

  function ketinggianMaksimum(V, teta, g){ // fungsi ini untuk ngitung etinggian maksimum atau Hmaks
    return (Math.pow(V, 2) * Math.pow(Math.sin(teta), 2)) / (2 * g);
  }


  function jarakXMaksimum(V, teta){ // fungsi untuk menghitung jarakMaksimum atau Xmaks
    return (Math.pow(V, 2) * Math.sin(2 * teta)) / g;
  }

  // Fungsi untuk menghitung kecepatan pada waktu tertentu, X tidak perlu karena konstant pada waktu apapun
  function velocity_x (){
    return V * Math.cos(teta);
  }
  function velocity_y(time) {
    return -(g * time) + (V * Math.sin(teta));
  }

});

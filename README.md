# Okuyorum

**Ege Üniversitesi** bitirme projem.
>Belirttiğim özellikler:
>Furkan Evran - Okuyorum 
(next / nodejs) 
İnternet üzerinde ücretsiz dağıtılan epub dosyalarınının içinden RegularExpression ile önemli verileri(Yazar, kapak fotoğrafı, türü, açıklama, bölümler ve bölümlerin içinde bulunan paragraflar ve stil dosyaları.) yakalayıp veri tabanına attıktan sonra online bir şekilde aşağıda belirtilen özelliklere sahip bir web sitesi: 
• Nextjs ile yapıldığından SPA olacak 
• Üyelik sistemi (üye olma ve giriş. bcrypt + JWT kullanılıyor. Auth sync bulunuyor.) 
•Kitabı favorilere ekleme 
•Kaydırarak chapter değiştirme 
• Bir chapter içindeki paragraflara yorum yapabilme, yorumları beğenebilme ve kendi yorumunu silebilme 
• Profil sayfası (Favorilere eklenen kitaplar ve yorumlar gözüküyor.) 
• Arama sayfası (Kitap adı ve tür ile arama, örnek: Roman) 
• Tam ekran yapma butonu 

İnternette bulunan epub dosyalarının çoğu yazardan veya kitapta hakkı olan yayınevinin izni dışında yasa dışı bir şekilde dağıtıldığı için projeyi herhangi bir arama motoruna eklemeyeceğim ve notumu aldıktan sonra yayınlamayacağım. Bu proje tamamen eğitim amaçlıdır.


## ENV Dosyaları

Örnek .env.devolopment.local
>DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=password
DB_NAME=okuyo
APP_SECRET=furkanevranmezunolurumarim_!°-egeüniversitesi 2020

## Veri Tabanı Şeması

![alt-text](https://github.com/sanctuxm/okuyorum/blob/master/okuyo%208.png?raw=true "Şema")
Başlarken daha fazla özellik eklemeyi düşünmüştüm fakat çalıştığımdan hepsini yerine getirmem mümkün olmadı.
Yukarıdaki metinde belirttiğim özelliklerin hepsi mevcut.

## Çalıştırma

Çalıştırmak için [PostgreSQL](https://www.postgresql.org/) yükeyip projenin olduğu konumda
```bash
yarn install
yarn run dev

veya

npm install
npm run dev
```
komutunu çalıştırabilirsiniz.

## Ekran Görüntüleri

![Anasayfa](https://user-images.githubusercontent.com/14177182/86344284-c4099280-bc62-11ea-8a89-40ee73756bff.png)
![Kitap içi](https://user-images.githubusercontent.com/14177182/86344425-f0bdaa00-bc62-11ea-9e96-be22acb66ce9.png)
![Arama](https://user-images.githubusercontent.com/14177182/86344596-1f3b8500-bc63-11ea-8f32-73f4f1387331.png)
![Kayıt](https://user-images.githubusercontent.com/14177182/86345091-c1f40380-bc63-11ea-8deb-185a36d8f745.png)
![Giriş](https://user-images.githubusercontent.com/14177182/86345088-c15b6d00-bc63-11ea-8e5f-17de0ef67f93.png)
![Profil](https://user-images.githubusercontent.com/14177182/86345083-bf91a980-bc63-11ea-9ada-4a104ea1a153.png)
![Paragrafın hover efekti](https://user-images.githubusercontent.com/14177182/86345089-c15b6d00-bc63-11ea-8710-6147a4cdfac5.png)
![Yorum modalı](https://user-images.githubusercontent.com/14177182/86345086-c0c2d680-bc63-11ea-8a9e-dc35261da360.png)

***
SPA olarak ilk projem olduğundan bir sürü hata olduğuna ve mantıksız yollar tercih ettiğimi düşünüyorum.
***
Lisans: [MIT](https://opensource.org/licenses/MIT)

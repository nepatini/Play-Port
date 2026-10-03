PROGRAMŲ SISTEMŲ PROJEKTAVIMAS 

Pateikimo šablonas 

# PlayPort 

Kursinio darbo I dalis: projektavimo dokumentas 

## **1. Problema ir idėja** 

**Sistema vienu sakiniu:** PlayPort– kompiuterinių žaidimų bibliotekos sistema, leidžianti vienoje vietoje valdyti žaidimus. 

**Problema ir dabartinis procesas:** Žaidėjai dažnai naudoja kelias platformas, tokias kaip Steam, Epic Games ar Riot Games. Kiekviena jų saugo atskirą žaidimų sąrašą, todėl nėra vienos vietos matyti visus žaidimus. 

**Nauda:** Naudotojas galės vienoje programoje matyti visą savo žaidimų biblioteką, greitai paleisti žaidimus. **Naudotojai:** Pagrindiniai sistemos naudotojai yra kompiuterinių žaidimų žaidėjai. Jie galės vienoje vietoje tvarkyti savo žaidimų biblioteką, automatiškai importuoti arba rankiniu būdu pridėti žaidimus, juos paleisti. **Prielaidos:** Daroma prielaida, kad sistema bus naudojama Windows operacinėje sistemoje, o naudotojo kompiuteryje jau yra įdiegti žaidimai. Taip pat laikoma prielaida, kad kiekvienas žaidimas turi galiojantį paleidžiamąjį (.exe) failą, kurį sistema gali naudoti jam paleisti. 

## **2. Apimtis** 

|**Funkcija**|**Ką naudotojas galės atlikti**|**Pagrindinis modulis ar pagalbinė**<br>**funkcija**|
|---|---|---|
|Žaidimų importavimas|Automatiškai nuskaityti kompiuteryje<br>įdiegtus žaidimus ir pridėti juos į PlayPort<br>biblioteką.|Pagalbinė funkcija|
|Rankinis žaidimo pridėjimas|Pridėti žaidimą nurodant jo .exe failą|Pagalbinė funkcija|
|Žaidimų bibliotekos valdymas|Peržiūrėti, ieškoti ir paleisti pasirinktus<br>žaidimus|Pagrindinis modulis|



#### **Į kursinio darbo apimtį neįeina:** 

- Naudotojų paskyrų ir prisijungimo sistema. 

- Debesų (cloud) duomenų sinchronizacija. 

- Draugų sąrašas ir socialinės funkcijos. 

- Žaidimų pirkimas ar parduotuvės integracija. 

- Kelių platformų internetinis duomenų bendrinimas. 

1 

Kursinio darbo I dalis 

PROGRAMŲ SISTEMŲ PROJEKTAVIMAS 

Pateikimo šablonas 

## **3. Pagrindinis modulis** 

**Pavadinimas ir atsakomybė:** Žaidimų bibliotekos valdymo modulis. Jo paskirtis – automatiškai aptikti kompiuteryje įdiegtus žaidimus, juos pridėti į PlayPort biblioteką ir leisti naudotojui juos paleisti iš vienos vietos. 

**Logika, kurią reikės projektuoti ir testuoti:** Sistema nuskaitys kompiuteryje esančius žaidimus, patikrins ar jie jau nėra bibliotekoje, pašalins pasikartojančius įrašus ir išsaugos informaciją duomenų bazėje. 

**Įvestis:** Kompiuteryje įdiegti žaidimai arba naudotojo pasirinktas .exe failas. Pavyzdys: Minecraft.exe. 

**Išvestis:** Žaidimas sėkmingai pridedamas į PlayPort biblioteką su pavadinimu, viršeliu ir paleidimo keliu. 

#### **Veikimo eiga:** 

- Naudotojas pasirenka automatinį nuskaitymą arba rankinį pridėjimą. 

- Sistema suranda įdiegtus žaidimus. 

- Patikrina, ar žaidimas jau egzistuoja bibliotekoje. 

- Nauji žaidimai išsaugomi SQLite duomenų bazėje. 

- Biblioteka atnaujinama ir žaidimai rodomi sąraše. 

### **Taisyklės arba sprendimo žingsniai** 

- Tas pats žaidimas negali būti pridėtas du kartus. 

- Pridedami tik žaidimai, turintys galiojantį .exe paleidimo failą. 

- Po importavimo biblioteka automatiškai atnaujinama. 

### **Scenarijai būsimiems testams** 

|**Scenarijus**|**Pradinės sąlygos ir konkreti**<br>**įvestis**|**Veiksmas**|**Tikslus laukiamas rezultatas**|
|---|---|---|---|
|Įprastas atvejis|Kompiuteryje įdiegtas Minecraft|Paspaudžiamas<br>„Nuskaityti žaidimus“|Minecraft atsiranda PlayPort<br>bibliotekoje|
|Ribinis atvejis arba<br>konfliktas|Minecraft jau yra bibliotekoje|Pakartotinai vykdomas<br>nuskaitymas|Antras toks pats įrašas<br>nesukuriamas|
|Klaida arba neįmanomas<br>rezultatas|Pasirinktas neegzistuojantis .exe<br>failas|Spaudžiamas „Pridėti“|Rodomas klaidos pranešimas ir<br>žaidimas nepridedamas|



**Jei modulis naudoja AI:** Netaikoma. 

## **4. Kokybės atributas** 

#### **Pasirinktas atributas:** Našumas 

**Kodėl svarbus šiai sistemai:** PlayPort turi greitai parodyti žaidimų biblioteką ir leisti naudotojui sklandžiai rasti bei paleisti žaidimus, net jei bibliotekoje yra daug įrašų. 

**Tikrinimo scenarijus ir sąlygos:** Duomenų bazėje saugoma 500 žaidimų. Naudotojas atidaro PlayPort ir įkelia žaidimų biblioteką. 

**Sėkmės kriterijus:** Biblioteka pilnai užkraunama per mažiau nei 1 sekundę. 

**Numatytas projektavimo sprendimas:** Naudoti SQLite duomenų bazę, indeksuoti pagrindinius laukus ir užkrauti tik reikalingus žaidimų duomenis. 

**Kaip patikrinsiu vėlesniame etape:** Atliksiu našumo testą su 100, 300 ir 500 žaidimų bibliotekomis ir palyginsiu užkrovimo laiką. 

**Sprendimo kaina arba ribojimas:** Optimizavimas reikalauja papildomo darbo projektuojant duomenų bazę ir indeksus, tačiau pagerina sistemos veikimo greitį. 

2 

Kursinio darbo I dalis 

PROGRAMŲ SISTEMŲ PROJEKTAVIMAS 

Pateikimo šablonas 

## **5. Pradinė sistemos struktūra** 

### **Paprasta schema** 



<!-- Start of picture text -->
Naudotojas. PlayPortvt SQLite.<br>React UI Logika Bibliotekaa<br>Importas<br><!-- End of picture text -->

|**Sistemos dalis**|**Atsakomybė**|
|---|---|
|Naudotojo sąsaja (React)|Leidžia peržiūrėti biblioteką, pridėti ir paleisti žaidimus.|
|Programos logika (Electron + TypeScript)|Nuskaito įdiegtus žaidimus, tikrina dublikatus ir valdo<br>biblioteką.|
|SQLite duomenų bazė|Saugo žaidimų pavadinimus, viršelius ir paleidimo kelius.|



#### **Planuojamos technologijos ir pasirinkimo priežastys:** 

- React – moderniai ir patogiai naudotojo sąsajai kurti. 

- Electron – leidžia sukurti Windows darbalaukio programą. 

- TypeScript – aiškesnei ir saugesnei programos logikai. 

- SQLite – lengvai vietinei duomenų bazei be serverio. 

## **6. AI panaudojimas** 

### **AI rengiant šį dokumentą** 

|**Priemonė ir užduotis**|**Ką panaudojau**|**Ką atmečiau arba perrašiau ir**<br>**kodėl**|**Kaip patikrinau**|
|---|---|---|---|
|ChatGPT – projektavimo<br>dokumento rengimas|Dokumento struktūrą ir<br>pirmines teksto<br>formuluotes|Tekstą perrašiau ir pritaikiau<br>PlayPort projektui|Palyginau su užduoties<br>reikalavimais ir pataisiau<br>rankiniu būdu|



### **Planuojamas AI naudojimas kuriant sistemą** 

**Kur ir kam naudosiu AI:** Programą kursiu naudodamas Visual Studio Code ir GitHub Copilot. AI naudosiu kodo pasiūlymams, funkcijų generavimui ir klaidų paieškai. 

**Kaip tikrinsiu pasiūlymus ir sugeneruotą kodą:** Kiekvieną GitHub Copilot pasiūlytą kodo dalį peržiūrėsiu, ištestuosiu programoje ir prireikus pakoreguosiu rankiniu būdu. 

**Ar AI bus sistemos funkcionalumo dalis:** Ne. 

3 

Kursinio darbo I dalis 

PROGRAMŲ SISTEMŲ PROJEKTAVIMAS Pateikimo šablonas 

## **7. Tolesnių darbų planas** 

|**Darbas**|**Apčiuopiamas rezultatas**|**Planuojama darbų seka**|
|---|---|---|
|SQLite duomenų bazės<br>sukūrimas|Sukurtos lentelės žaidimams saugoti|1|
|Naudotojo sąsajos sukūrimas|Veikiantis pagrindinis PlayPort langas|2|
|Žaidimų aptikimo funkcija|Automatiškai randami įdiegti žaidimai|3|
|Rankinio pridėjimo funkcija|Galimybė pridėti žaidimą pagal .exe failą|4|
|Bibliotekos testavimas|Patikrintas žaidimų importavimas ir<br>paleidimas|5|



**Būsimo prototipo veikimo scenarijus:** Naudotojas paleidžia PlayPort, pasirenka „Nuskaityti žaidimus“, sistema automatiškai aptinka kompiuteryje įdiegtus žaidimus ir prideda juos į biblioteką. Pasirinkus vieną iš jų, žaidimas sėkmingai paleidžiamas. 

|**Rizika arba neaiškumas**|**Kaip patikrinsiu arba sumažinsiu**|
|---|---|
|Ne visi įdiegti žaidimai bus aptikti automatiškai|Testuosiu su skirtingomis žaidimų platformomis ir paliksiu<br>rankinio pridėjimo galimybę|
|Gali atsirasti pasikartojantys žaidimų įrašai|Prieš išsaugant tikrinsiu, ar toks žaidimas jau yra duomenų<br>bazėje|



## **Šaltiniai, jei naudojote** 

- React oficiali dokumentacija 

- Electron oficiali dokumentacija 

- SQLite oficiali dokumentacija 

4 

Kursinio darbo I dalis 


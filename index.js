const BASE_URL = 'http://localhost:8000';  // ตั้งค่าฐาน URL ของ API
let mode = 'CREATE'; // ค่าเริ่มต้นเป็น 'CREATE' สำหรับการสร้างข้อมูล
let selectid = ''; // เก็บ ID ของผู้ใช้ที่จะแก้ไข

// เมื่อโหลดหน้าจอ
window.onload = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');  // ดึง ID จาก URL

    if (id) {  // ถ้ามี ID แสดงว่าเรากำลังแก้ไขข้อมูล
        mode = 'EDIT';  // เปลี่ยนโหมดเป็น EDIT
        selectid = id;  // กำหนด ID สำหรับการอัปเดตข้อมูล

        // ดึงข้อมูลของผู้ใช้ที่ต้องการแก้ไข
        try {
            const response = await axios.get(`${BASE_URL}/user/${id}`);  // URL ที่แก้ไขให้ถูกต้อง
            const user = response.data;

            // นำข้อมูลของ user ไปเติมในฟอร์ม
            let firstNameDOM = document.querySelector('input[name=firstname]');
            let lastNameDOM = document.querySelector('input[name=lastname]');
            let ageDOM = document.querySelector('input[name=age]');
            let descriptionDOM = document.querySelector('textarea[name=description]');
            let genderDOMs = document.querySelectorAll('input[name=gender]');
            let interestDOMs = document.querySelectorAll('input[name=interest]');

            firstNameDOM.value = user.firstName;
            lastNameDOM.value = user.lastName;
            ageDOM.value = user.age;
            descriptionDOM.value = user.description;

            // ตรวจสอบเพศและเลือกให้ตรง
            genderDOMs.forEach(genderDOM => {
                if (genderDOM.value === user.gender) {
                    genderDOM.checked = true;
                }
            });

            // ตรวจสอบความสนใจและเลือกให้ตรง
            interestDOMs.forEach(interestDOM => {
                if (user.interests.includes(interestDOM.value)) {
                    interestDOM.checked = true;
                }
            });

        } catch (error) {
            console.log('Error fetching user data:', error);
        }
    }
};

// ฟังก์ชันตรวจสอบข้อมูลที่กรอก
const validateData = (userData) => {
    let errors = [];

    // ตรวจสอบข้อมูลที่กรอก
    if (!userData.firstName) {
        errors.push('กรุณากรอกชื่อ');
    }
    if (!userData.lastName) {
        errors.push('กรุณากรอกนามสกุล');
    }
    if (!userData.age) {
        errors.push('กรุณากรอกอายุ');
    }
    if (!userData.gender) {
        errors.push('กรุณาเลือกเพศ');
    }
    if (!userData.interests || userData.interests.length === 0) {
        errors.push('กรุณาเลือกความสนใจ');
    }
    if (!userData.description) {
        errors.push('กรุณากรอกคำอธิบาย');
    }

    return errors;
};

const submitData = async () => {
    let firstNameDOM = document.querySelector('input[name=firstname]');
    let lastNameDOM = document.querySelector('input[name=lastname]');
    let ageDOM = document.querySelector('input[name=age]');
    let genderDOM = document.querySelector('input[name=gender]:checked') || {};
    let interestDOMs = document.querySelectorAll('input[name=interest]:checked') || [];
    let descriptionDOM = document.querySelector('textarea[name=description]');
    let messageDOM = document.getElementById('message');

    try {
        let interest = Array.from(interestDOMs).map(i => i.value).join(',');

        let userData = {
            firstName: firstNameDOM.value,
            lastName: lastNameDOM.value,
            age: ageDOM.value,
            gender: genderDOM.value,
            interests: interest,
            description: descriptionDOM.value,
        };

        console.log("userData", userData); // ตรวจสอบข้อมูลที่จะส่ง

        const errors = validateData(userData);
        if (errors.length > 0) {
            throw {
                message: 'กรุณากรอกข้อมูลให้ครบถ้วน',
                errors: errors
            };
        }

        let message = 'บันทึกข้อมูลเรียบร้อย';
        let response;
        if (mode == 'CREATE') {
            response = await axios.post(`${BASE_URL}/user`, userData);  // ตรวจสอบ URL ให้ตรง
            console.log('Response:', response.status, response.data);
        } else {
            response = await axios.put(`${BASE_URL}/user/${selectid}`, userData);  // ตรวจสอบ URL ให้ตรง
            message = 'แก้ไขข้อมูลเรียบร้อย';
            console.log('Response:', response.status, response.data);
        }

        if (response.status === 200 || response.status === 201) {
            messageDOM.innerText = message;
            messageDOM.className = 'message success';
        } else {
            messageDOM.innerText = 'เกิดข้อผิดพลาดในการบันทึกข้อมูล';
            messageDOM.className = 'message danger';
        }

    } catch (error) {
        let htmlData = '<div>';
        htmlData += `<div> ${error.message} </div>`;
        htmlData += '<ul>';

        if (error.errors) {
            error.errors.forEach((err) => {
                htmlData += `<li>${err}</li>`;
            });
        }

        htmlData += '</ul>';
        htmlData += '</div>';

        messageDOM.innerHTML = htmlData;
        messageDOM.className = 'message danger';
    }
};

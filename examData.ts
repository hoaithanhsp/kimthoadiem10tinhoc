import { ExamStructure } from './types';

// Mock data cho Đề 01
export const EXAM_01: ExamStructure = {
    id: 'exam-01',
    name: 'Đề 01',

    // Phần I: 24 câu trắc nghiệm (0.25đ/câu, tổng 6đ)
    part1: [
        {
            questionNumber: 1,
            question: 'Các thành phần của AI bao gồm?',
            options: {
                A: 'Kiến thức, suy luận, học máy',
                B: 'Phần cứng, phần mềm, dữ liệu',
                C: 'CPU, RAM, GPU',
                D: 'Input, Output, Process'
            },
            correctAnswer: 'A'
        },
        {
            questionNumber: 2,
            question: 'Địa chỉ IP nào sau đây là địa chỉ IP lớp C?',
            options: {
                A: '10.0.0.1',
                B: '172.16.0.1',
                C: '192.168.1.1',
                D: '224.0.0.1'
            },
            correctAnswer: 'C'
        },
        {
            questionNumber: 3,
            question: 'Trong Python, lệnh nào dùng để in ra màn hình?',
            options: {
                A: 'echo()',
                B: 'print()',
                C: 'output()',
                D: 'write()'
            },
            correctAnswer: 'B'
        },
        {
            questionNumber: 4,
            question: 'Giao thức nào được sử dụng để gửi email?',
            options: {
                A: 'HTTP',
                B: 'FTP',
                C: 'SMTP',
                D: 'TCP'
            },
            correctAnswer: 'C'
        },
        {
            questionNumber: 5,
            question: 'Loại mạng nào có phạm vi địa lý nhỏ nhất?',
            options: {
                A: 'WAN',
                B: 'MAN',
                C: 'LAN',
                D: 'PAN'
            },
            correctAnswer: 'D'
        },
        {
            questionNumber: 6,
            question: 'Machine Learning là gì?',
            options: {
                A: 'Máy tính tự học từ dữ liệu',
                B: 'Lập trình bằng ngôn ngữ máy',
                C: 'Sửa chữa máy tính',
                D: 'Thiết kế phần cứng'
            },
            correctAnswer: 'A'
        },
        {
            questionNumber: 7,
            question: 'Cổng mặc định của HTTP là?',
            options: {
                A: '21',
                B: '22',
                C: '80',
                D: '443'
            },
            correctAnswer: 'C'
        },
        {
            questionNumber: 8,
            question: 'Kiểu dữ liệu nào sau đây là kiểu số thực trong Python?',
            options: {
                A: 'int',
                B: 'str',
                C: 'float',
                D: 'bool'
            },
            correctAnswer: 'C'
        },
        {
            questionNumber: 9,
            question: 'DNS dùng để làm gì?',
            options: {
                A: 'Gửi file',
                B: 'Chuyển tên miền thành địa chỉ IP',
                C: 'Bảo mật mạng',
                D: 'In tài liệu'
            },
            correctAnswer: 'B'
        },
        {
            questionNumber: 10,
            question: 'Thiết bị nào kết nối các mạng LAN với nhau?',
            options: {
                A: 'Hub',
                B: 'Switch',
                C: 'Router',
                D: 'Repeater'
            },
            correctAnswer: 'C'
        },
        {
            questionNumber: 11,
            question: 'Deep Learning là một nhánh của?',
            options: {
                A: 'Big Data',
                B: 'Machine Learning',
                C: 'Cloud Computing',
                D: 'Blockchain'
            },
            correctAnswer: 'B'
        },
        {
            questionNumber: 12,
            question: 'Hàm len() trong Python dùng để?',
            options: {
                A: 'Tính tổng',
                B: 'Đếm số phần tử',
                C: 'Sắp xếp',
                D: 'Tìm kiếm'
            },
            correctAnswer: 'B'
        },
        {
            questionNumber: 13,
            question: 'HTTPS sử dụng cổng mặc định nào?',
            options: {
                A: '80',
                B: '21',
                C: '443',
                D: '8080'
            },
            correctAnswer: 'C'
        },
        {
            questionNumber: 14,
            question: 'Topology mạng nào có dạng hình sao?',
            options: {
                A: 'Bus',
                B: 'Ring',
                C: 'Star',
                D: 'Mesh'
            },
            correctAnswer: 'C'
        },
        {
            questionNumber: 15,
            question: 'Trong Python, toán tử // dùng để?',
            options: {
                A: 'Chia lấy dư',
                B: 'Chia lấy phần nguyên',
                C: 'Lũy thừa',
                D: 'Nhân'
            },
            correctAnswer: 'B'
        },
        {
            questionNumber: 16,
            question: 'AI có thể ứng dụng trong lĩnh vực nào?',
            options: {
                A: 'Y tế',
                B: 'Giáo dục',
                C: 'Giao thông',
                D: 'Tất cả các lĩnh vực trên'
            },
            correctAnswer: 'D'
        },
        {
            questionNumber: 17,
            question: 'Mô hình OSI có bao nhiêu tầng?',
            options: {
                A: '4',
                B: '5',
                C: '6',
                D: '7'
            },
            correctAnswer: 'D'
        },
        {
            questionNumber: 18,
            question: 'List trong Python có thể thay đổi (mutable)?',
            options: {
                A: 'Đúng',
                B: 'Sai',
                C: 'Tùy trường hợp',
                D: 'Không xác định'
            },
            correctAnswer: 'A'
        },
        {
            questionNumber: 19,
            question: 'Giao thức nào dùng để truyền file?',
            options: {
                A: 'HTTP',
                B: 'FTP',
                C: 'SMTP',
                D: 'DNS'
            },
            correctAnswer: 'B'
        },
        {
            questionNumber: 20,
            question: 'Neural Network được lấy cảm hứng từ?',
            options: {
                A: 'Máy tính',
                B: 'Bộ não con người',
                C: 'Internet',
                D: 'Điện thoại'
            },
            correctAnswer: 'B'
        },
        {
            questionNumber: 21,
            question: 'Địa chỉ MAC có độ dài bao nhiêu bit?',
            options: {
                A: '32',
                B: '48',
                C: '64',
                D: '128'
            },
            correctAnswer: 'B'
        },
        {
            questionNumber: 22,
            question: 'Lệnh nào dùng để tạo vòng lặp trong Python?',
            options: {
                A: 'if',
                B: 'for',
                C: 'def',
                D: 'return'
            },
            correctAnswer: 'B'
        },
        {
            questionNumber: 23,
            question: 'Natural Language Processing (NLP) là?',
            options: {
                A: 'Xử lý ngôn ngữ tự nhiên',
                B: 'Xử lý hình ảnh',
                C: 'Xử lý âm thanh',
                D: 'Xử lý video'
            },
            correctAnswer: 'A'
        },
        {
            questionNumber: 24,
            question: 'Firewall dùng để?',
            options: {
                A: 'Tăng tốc mạng',
                B: 'Bảo vệ mạng',
                C: 'Chia sẻ file',
                D: 'Kết nối Internet'
            },
            correctAnswer: 'B'
        }
    ],

    // Phần II: 2 câu Đúng/Sai (Câu 1, 2)
    part2: [
        {
            questionNumber: 1,
            mainText: 'Cho nhận định về mạng LAN. Trong mỗi ý a), b), c), d), thí sinh chọn đúng hoặc sai.',
            options: [
                { id: 'a', text: 'Mạng cục bộ chỉ có thể sử dụng cáp có dây', isCorrect: false },
                { id: 'b', text: 'Đặc trưng cơ bản của mạng LAN là cùng khu vực địa lý nhỏ', isCorrect: true },
                { id: 'c', text: 'Để kết nối với các mạng LAN với nhau cần sử dụng Router', isCorrect: true },
                { id: 'd', text: 'Phát hiện đèn tín hiệu có thể kết nối thiết bị trong mạng LAN', isCorrect: false }
            ]
        },
        {
            questionNumber: 2,
            mainText: 'Dữ liệu về dân số nước ta từ năm 2019 đến năm 2023 có trong Tổng cục thống kê. Đề lưu trữ và khai thác dữ liệu theo hình 1, một số nhận xét sau. Trong mỗi ý a), b), c), d), thí sinh chọn đúng hoặc sai.',
            options: [
                { id: 'a', text: 'KHUVUC (mauKV, tenKV) lưu thông tin mã khu vực và tên khu vực; có một khoá vụ có mật khu vực này duy.', isCorrect: true },
                { id: 'b', text: 'TINH (maTinh, mauKV, tenTinh) lưu thông tin mã tỉnh, mật khu vực và tên tỉnh; mỗi tỉnh khu vực và mỗi khu vực có thể có nhiều tỉnh.', isCorrect: true },
                { id: 'c', text: 'Trường mauKV là khoá ngoại của bảng KHUVUC', isCorrect: false },
                { id: 'd', text: 'DANSO (maTinh, nam, danchof89) lưu thông tin: mã tỉnh, năm và dân số trong binh cua nam.', isCorrect: true }
            ]
        }
    ],

    // Phần III - Option 1: Câu 3, 4 (Khoa học máy tính)
    part3Option1: [
        {
            questionNumber: 3,
            mainText: 'Router có chức năng chính như sau đây?',
            options: [
                { id: 'a', text: 'A. Kết nối các thiết bị bằng cổng mở rộng để tăng thêm mạng LAN này với nhau và chọn đuơng để gửp nhất thống qua router.', isCorrect: true },
                { id: 'b', text: 'B. Tìm đường đi tốt cho mỗi Access Point và kết nối thiết bị nay với mạng SW ích phong để.', isCorrect: false },
                { id: 'c', text: 'C. Để kết nói nơi trong các phòng làm việc truy cập được Internet thì câu để lắp đặt then mước Modern mà không cần phải đưng ký với nhà cung cấp dịch vụ Internet.', isCorrect: false },
                { id: 'd', text: 'D. Để cảc nhân viên có thể sử dung điện thoại thông minh kết nối được vào mạng cục bộ của công ty qua Wifi, có thể lập thêm cho mỗi phòng một Access Point và kết nối thiết bị nay với Switch ở phòng đó.', isCorrect: true }
            ]
        },
        {
            questionNumber: 4,
            mainText: 'Cho đoạn chương trình Python sau. Trong mỗi ý a), b), c), d), thí sinh chọn đúng hoặc sai.',
            options: [
                { id: 'a', text: 'Biến a có giá trị là 5 sau khi thực hiện đoạn code', isCorrect: true },
                { id: 'b', text: 'Vòng lặp while thực hiện 3 lần', isCorrect: false },
                { id: 'c', text: 'Kết quả in ra màn hình là 10', isCorrect: true },
                { id: 'd', text: 'Chương trình có lỗi cú pháp', isCorrect: false }
            ]
        }
    ],

    // Phần III - Option 2: Câu 5, 6 (Tin học ứng dụng)
    part3Option2: [
        {
            questionNumber: 5,
            mainText: 'Cho các nhận định về ứng dụng AI trong thực tế. Trong mỗi ý a), b), c), d), thí sinh chọn đúng hoặc sai.',
            options: [
                { id: 'a', text: 'ChatGPT là một ứng dụng của xử lý ngôn ngữ tự nhiên', isCorrect: true },
                { id: 'b', text: 'AI không thể được sử dụng trong lĩnh vực y tế', isCorrect: false },
                { id: 'c', text: 'Nhận diện khuôn mặt là ứng dụng của Computer Vision', isCorrect: true },
                { id: 'd', text: 'Machine Learning không cần dữ liệu để học', isCorrect: false }
            ]
        },
        {
            questionNumber: 6,
            mainText: 'Cho nhận định về cơ sở dữ liệu. Trong mỗi ý a), b), c), d), thí sinh chọn đúng hoặc sai.',
            options: [
                { id: 'a', text: 'Khóa chính có thể chứa giá trị NULL', isCorrect: false },
                { id: 'b', text: 'Một bảng có thể có nhiều khóa ngoại', isCorrect: true },
                { id: 'c', text: 'SQL là ngôn ngữ truy vấn có cấu trúc', isCorrect: true },
                { id: 'd', text: 'Mỗi bảng phải có ít nhất một khóa chính', isCorrect: true }
            ]
        }
    ]
};

// Danh sách tất cả các đề
export const ALL_EXAMS: ExamStructure[] = [
    EXAM_01,
    // Thêm các đề khác ở đây
];

// Lấy đề theo ID
export function getExamById(id: string): ExamStructure | undefined {
    return ALL_EXAMS.find(e => e.id === id);
}

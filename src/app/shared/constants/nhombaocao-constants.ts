export class keyNhomBaoCao {
    public static QuyHoach = 'quyhoach';
    public static BaoCaoDieuTraKhaoSat = 'baocaodieutrakhaosat';
    public static BaoCaoHoatDong = 'baocaohoatdong';
    public static BanDo = 'bando';
    public static ThongTinTuLieu = 'thongtintulieu';
}

export const idNhomBaoCao: any = {
    [keyNhomBaoCao.QuyHoach]: 1,
    [keyNhomBaoCao.BaoCaoDieuTraKhaoSat]: 2,
    [keyNhomBaoCao.BaoCaoHoatDong]: 3,
    [keyNhomBaoCao.BanDo]: 4,
    [keyNhomBaoCao.ThongTinTuLieu]: 5
}

export const nameNhomBaoCao: any = {
    [keyNhomBaoCao.QuyHoach]: "Quy hoạch",
    [keyNhomBaoCao.BaoCaoDieuTraKhaoSat]: "Báo cáo điều tra khảo sát",
    [keyNhomBaoCao.BaoCaoHoatDong]: "Báo cáo hoạt động",
    [keyNhomBaoCao.BanDo]: "Bản đồ",
    [keyNhomBaoCao.ThongTinTuLieu]: "Thông tin tư liệu"
}

export const NhomBaoCao = [
    {
        id: idNhomBaoCao[keyNhomBaoCao.QuyHoach],
        name: nameNhomBaoCao[keyNhomBaoCao.QuyHoach]
    },
    {
        id: idNhomBaoCao[keyNhomBaoCao.BaoCaoDieuTraKhaoSat],
        name: nameNhomBaoCao[keyNhomBaoCao.BaoCaoDieuTraKhaoSat]
    },
    {
        id: idNhomBaoCao[keyNhomBaoCao.BaoCaoHoatDong],
        name: nameNhomBaoCao[keyNhomBaoCao.BaoCaoHoatDong]
    },
    {
        id: idNhomBaoCao[keyNhomBaoCao.BanDo],
        name: nameNhomBaoCao[keyNhomBaoCao.BanDo]
    },
    {
        id: idNhomBaoCao[keyNhomBaoCao.ThongTinTuLieu],
        name: nameNhomBaoCao[keyNhomBaoCao.ThongTinTuLieu]
    }
];
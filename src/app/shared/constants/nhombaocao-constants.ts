export class keyNhomBaoCao {
    public static QuyHoach = 'quyhoach';
    public static BanDo = 'bando';
    public static BaoCaoDieuTraKhaoSat = 'baocaodieutrakhaosat';
    public static BaoCaoHoatDong = 'baocaodinhkyhoatdong';
    public static BaoCaoGiamSatHoatDong = 'baocaogiamsathoatdong';
    public static ThongTinTuLieu = 'thongtintulieu';
}

export const idNhomBaoCao: any = {
    [keyNhomBaoCao.QuyHoach]: 1,
    [keyNhomBaoCao.BanDo]: 2,
    [keyNhomBaoCao.BaoCaoDieuTraKhaoSat]: 3,
    [keyNhomBaoCao.BaoCaoHoatDong]: 4,
    [keyNhomBaoCao.BaoCaoGiamSatHoatDong]: 5,
    [keyNhomBaoCao.ThongTinTuLieu]: 6
}

export const nameNhomBaoCao: any = {
    [keyNhomBaoCao.QuyHoach]: "Quy hoạch",
    [keyNhomBaoCao.BanDo]: "Bản đồ",
    [keyNhomBaoCao.BaoCaoDieuTraKhaoSat]: "Báo cáo điều tra khảo sát",
    [keyNhomBaoCao.BaoCaoHoatDong]: "Báo cáo định kỳ hoạt động",
    [keyNhomBaoCao.BaoCaoGiamSatHoatDong]: "Báo cáo giám sát hoạt động",
    [keyNhomBaoCao.ThongTinTuLieu]: "Thông tin tư liệu"
}

export const NhomBaoCao = [
    {
        id: idNhomBaoCao[keyNhomBaoCao.QuyHoach],
        name: nameNhomBaoCao[keyNhomBaoCao.QuyHoach]
    },
    {
        id: idNhomBaoCao[keyNhomBaoCao.BanDo],
        name: nameNhomBaoCao[keyNhomBaoCao.BanDo]
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
        id: idNhomBaoCao[keyNhomBaoCao.BaoCaoGiamSatHoatDong],
        name: nameNhomBaoCao[keyNhomBaoCao.BaoCaoGiamSatHoatDong]
    },
    {
        id: idNhomBaoCao[keyNhomBaoCao.ThongTinTuLieu],
        name: nameNhomBaoCao[keyNhomBaoCao.ThongTinTuLieu]
    }
];
export const vi = {
  // Header & Meta
  title: 'Sức Mua Thời Gian Sống',
  subtitle: 'Thời gian sống còn lại là tài sản duy nhất bạn chắc chắn sẽ tiêu và không bao giờ kiếm thêm được.',
  lang_en: 'EN',
  lang_vi: 'VI',
  model_normal: 'Phân phối Chuẩn (Normal)',
  model_gompertz: 'Quy luật Tử vong Gompertz',
  model_lev: 'Vận tốc Thoát Lão hóa (LEV)',
  mode_simple: 'Đơn giản',
  mode_detailed: 'Chi tiết',
  btn_share: 'Chia sẻ & Xuất',
  btn_reset: 'Đặt lại Mặc định',
  btn_export_json: 'Xuất JSON',
  btn_import_json: 'Nhập JSON',

  // View sections switcher
  tab_section_all: 'Tất cả Góc nhìn',
  tab_section_purchasing_power: 'Sức Mua Cuộc Đời',
  tab_section_human_infra: 'Động Cơ Kéo Dài Chủ Thể',

  // Section titles
  section_script: 'Kịch Bản Của Bạn',
  section_script_desc: 'Thiết lập độ tuổi hiện tại, nhịp sinh hoạt hàng ngày và tham số mô hình tuổi thọ.',
  section_evaluation: 'Đánh Giá Tổng Thể',
  section_evaluation_desc: 'Sức mua thời gian còn lại của bạn qua lăng kính vật lý, thời gian thức và cảm nhận chủ quan.',
  section_chart: 'Phân Phối Xác Suất Tuổi Thọ',
  section_chart_hint: 'Kéo điểm mốc màu vàng hoặc dùng phím Mũi tên Trái/Phải để điều chỉnh tuổi thọ kỳ vọng.',
  section_comparison: 'So Sánh Các Kịch Bản',
  section_comparison_desc: 'Đối chiếu song song giữa ba giả định: kịch bản xấu nhất, hiện trạng và tốt nhất.',
  section_equivalents: 'Quy Đổi Sức Mua Cuộc Đời',
  section_equivalents_desc: 'Chuyển hóa số năm còn lại thành những đơn vị gần gũi, hữu hình mà bạn có thể cảm nhận và chi tiêu.',
  section_countdown: 'Đồng Hồ Đếm Ngược Trực Tiếp',
  section_countdown_hint: 'Tích tắc từng giây trôi qua. Nhắc nhở ta trân quý từng khoảnh khắc hiện tại.',

  // Human Infra Section Header
  section_human_infra_title: 'Human Infra: Động Cơ Kéo Dài Khả Năng Chủ Thể',
  section_human_infra_desc:
    'Biến sự tồn tại tiếp diễn của bạn—để hành động, học hỏi, sáng tạo và bước tới tương lai—thành một bài toán kỹ thuật.',

  // Inputs
  label_current_age: 'Tuổi hiện tại',
  label_scenario_preset: 'Kịch bản tuổi thọ mẫu',
  preset_worst: 'Xấu nhất (μ68, σ7)',
  preset_status_quo: 'Hiện trạng (μ79, σ9)',
  preset_best: 'Tốt nhất (μ93, σ6)',
  preset_custom: 'Tùy chỉnh Tham số',
  label_mean_lifespan: 'Tuổi thọ kỳ vọng (μ)',
  label_std_dev: 'Độ lệch chuẩn tuổi thọ (σ)',
  label_gompertz_modal: 'Độ tuổi tử vong đỉnh (M)',
  label_gompertz_beta: 'Hệ số phân tán (β)',
  label_overlays: 'Hiển thị đè các đường kịch bản',
  overlay_worst: 'Xấu nhất (68)',
  overlay_status_quo: 'Hiện trạng (79)',
  overlay_best: 'Tốt nhất (93)',

  label_sleep_hours: 'Giấc ngủ mỗi ngày',
  label_work_hours: 'Làm việc mỗi ngày',
  label_commute_hours: 'Đi lại mỗi ngày',
  label_screen_hours: 'Dùng màn hình mỗi ngày',
  label_meals_per_day: 'Bữa ăn mỗi ngày',
  label_books_per_year: 'Sách đọc mỗi năm',
  label_memory_start: 'Tuổi bắt đầu ghi nhớ (m)',
  label_baseline_age: 'Tuổi mốc cảm nhận (b)',
  label_daily_focus: 'Giờ tập trung sáng tạo đỉnh cao',
  label_ai_factor: 'Hệ số đòn bẩy AI & công cụ',

  warning_overallocated: 'Cảnh báo: Tổng thời gian ngủ, làm việc, đi lại và màn hình vượt quá 24 giờ/ngày! Thời gian rảnh bị giới hạn về 0.',

  // Headline Cards
  card_effective_awake: 'Thời Gian Thức Hiệu Dụng',
  card_effective_awake_desc: 'Số năm còn lại sau khi trừ đi giấc ngủ (~{days} ngày thức/năm).',
  card_calendar_years: 'Tuổi Thọ Lịch Kỳ Vọng',
  card_calendar_years_desc: 'Kỳ vọng toán học có điều kiện về số năm còn sống (không bao giờ âm).',
  card_free_time: 'Thời Gian Tự Do Tuyệt Đối',
  card_free_time_desc: 'Tổng số giờ tự do sau khi trừ ngủ, làm việc, đi lại và màn hình ({hours} giờ/ngày).',
  card_percentile_range: 'Khoảng Phân Vị 10% – 90%',
  card_percentile_desc: 'Độ bất định thực tế: 80% xác suất bạn sẽ nằm trong khoảng này.',
  years_suffix: 'năm',
  hours_suffix: 'giờ',
  days_suffix: 'ngày',
  range_format: 'từ {p10} đến {p90} năm nữa',
  end_age_format: 'Chạm mốc {age} tuổi',

  // Subjective Weber-Fechner
  card_subjective_progress: 'Đã Tiêu Dùng (Theo Cảm Nhận)',
  card_subjective_progress_desc: 'Thời gian tâm lý tỷ lệ theo hàm logarit: năm thứ n chỉ dài bằng 1/n ký ức.',
  card_feels_half: 'Cảm Giác Nửa Đời Người Ở',
  card_feels_half_desc: 'Ở mốc {age} tuổi, 50% thời lượng ký ức cảm nhận chủ quan đã trôi qua.',
  card_time_inflation: 'Lạm Phát Thời Gian',
  card_time_inflation_desc: '{remaining} năm theo lịch còn lại sẽ chỉ có cảm giác dài bằng {subj} năm ở tuổi {b}.',
  subjective_disclaimer: 'Mô hình giả thuyết theo định luật Weber-Fechner, không phải kết luận y học thần kinh.',

  // LEV mode
  lev_badge: 'Chế độ Vận tốc Thoát Lão hóa (LEV) Đang Bật',
  lev_title: 'Chân Trời Tuổi Thọ Vô Hạn',
  lev_desc: 'Trong trạng thái LEV, lão hóa sinh học được tách rời khỏi dòng thời gian. Giới hạn duy nhất là Kỷ nguyên Sao của vũ trụ.',
  lev_bound_label: 'Chân Trời Vũ Trụ',
  lev_bound_val: '~10¹⁴ năm (~100 nghìn tỷ năm)',
  lev_cosmic_horizon_desc: 'Thời gian tồn tại còn lại của các sao lùn đỏ trừ đi tuổi hiện tại của vũ trụ.',

  // Human Infra: Healthspan & The Golden Window
  card_healthspan_title: 'Tuổi Thọ Khỏe Mạnh & Cửa Sổ Vàng',
  card_healthspan_desc:
    'Tuổi thọ khỏe mạnh (HALE) là khoảng thời gian thể lực đỉnh cao, hoàn toàn tự chủ và không bị cản trở bởi bệnh mạn tính.',
  label_golden_window: 'Cửa Sổ Vàng (Sung Sức)',
  label_fragility_era: 'Thời Kỳ Lắng Đọng (Tuổi Già)',
  golden_window_format: 'Còn {years} năm thể lực sung sức đỉnh cao',
  fragility_era_format: 'Dự kiến ~{years} năm tuổi già tĩnh lặng',
  hale_age_format: 'Duy trì thể chất nguyên vẹn tới tuổi {age}',

  // Human Infra: Deep Focus Engine
  card_focus_title: 'Động Cơ Tập Trung Sâu Đỉnh Cao',
  card_focus_desc:
    'Tổng số giờ chú ý sáng tạo không gián đoạn sau khi trừ hao mòn sinh hoạt và việc vụn vặt ({hours} h/ngày).',
  label_mastery_quotas: 'Hạn Ngạch 10.000 Giờ Chuyên Gia',
  mastery_quotas_desc:
    'Đủ quỹ thời gian tập trung cao độ để thành thạo từ con số 0 ở {count} lĩnh vực hoàn toàn khác biệt.',

  // Human Infra: Accelerated Returns Flywheel
  card_flywheel_title: 'Bánh Đà Tăng Tốc Lợi Nhuận',
  card_flywheel_desc:
    'Định luật cốt lõi của Human Infra: Thời gian còn lại càng dài, cái giá của thất bại trong các đại dự án càng thấp.',
  flywheel_3yr_eras: 'Chương Đời 3 Năm',
  flywheel_3yr_desc:
    'Còn {count} chương đời 3 năm riêng biệt để bạn tái sinh sự nghiệp, kỹ năng hoặc phong cách sống.',
  flywheel_failure_runway: 'Đường Băng Cho Phép Thất Bại',
  flywheel_failure_desc:
    'Bạn có thể thất bại trắng tay ở {count} dự án thử nghiệm 2 năm trước khi cửa sổ vàng khép lại mà không sợ mất tất cả.',

  // Human Infra: The Calendar Bridge
  card_calendar_bridge_title: 'Cây Cầu Thời Gian & Lộ Trình Công Nghệ',
  card_calendar_bridge_desc:
    'Kết nối dòng đời cá nhân của bạn với bản đồ vĩ mô của công nghệ sinh học và kéo dài tuổi thọ.',
  bridge_target_year_format: 'Dự kiến bước sang năm dương lịch {year}',
  bridge_golden_year_format: 'Giai đoạn thể lực sung mãn kéo dài tới năm {year}',
  milestone_2035_title: '2035: Tiêu Diệt Tế Bào Già & mRNA Phòng Ngừa',
  milestone_2035_desc: 'Làm sạch tế bào lão hóa định kỳ và vắc-xin ung thư cá nhân hóa.',
  milestone_2040_title: '2040: Vận Tốc Thoát Lão Hóa (LEV)',
  milestone_2040_desc: 'Y học tăng hơn 1 năm tuổi thọ cho mỗi 1 năm dương lịch trôi qua.',
  milestone_2045_title: '2045: Thay Thế Toàn Bộ Nội Tạng Sinh Học',
  milestone_2045_desc: 'In 3D nội tạng sinh học hoàn chỉnh và ghép tạng biến đổi gen an toàn.',
  milestone_2055_title: '2055+: Tái Lập Trình Biểu Sinh & Đình Chỉ Sinh Học',
  milestone_2055_desc: 'Đảo ngược tuổi biểu sinh trực tiếp và bảo tồn liên kết thần kinh não bộ.',
  milestone_reached: 'Trong Tầm Với',
  milestone_beyond: 'Cần Đạt Mốc LEV',

  // Human Infra: AI Leverage
  card_ai_leverage_title: 'Đòn Bẩy AI & Công Cụ Trí Tuệ',
  card_ai_leverage_desc:
    'Công cụ và AI khuếch đại tổng sản lượng trí tuệ và giải quyết vấn đề cả đời của bạn như thế nào.',
  ai_amplified_years: 'Tương đương {years} năm thức của sản lượng trí tuệ thời tiền AI',
  ai_career_equivalents: 'Bằng sản lượng của ~{careers} cả đời sự nghiệp 40 năm của người xưa',

  // Human Infra: Boundary Diagnostic
  card_boundary_diagnostic_title: 'Chi Tiêu Nội Tại vs. Duy Trì Nền Tảng',
  card_boundary_diagnostic_desc:
    'Bạn có đang đầu tư đủ để duy trì bản thể tiếp tục cuộc chơi, hay chỉ tối ưu hóa cục bộ bên trong đồng hồ đếm ngược?',
  label_boundary_condition: 'Đầu Tư Bản Thể (Giấc ngủ & Phục hồi cơ thể)',
  label_boundary_within: 'Chi Tiêu Nội Tại (Làm việc, Đi lại, Màn hình, Giải trí)',
  boundary_insight_good:
    'Nền tảng vững chắc: Bạn dành đủ tài nguyên để nuôi dưỡng và bảo vệ bản thể sinh học và nhận thức.',
  boundary_insight_low:
    'Nền tảng hao mòn: Áp lực công việc và màn hình đang bào mòn chính bản thể mà bạn cần để bước tới tương lai.',

  // Chart labels
  chart_you_now: 'Bạn (hiện tại: {age})',
  chart_expected_end: 'Dự kiến kết thúc ({age})',
  chart_axis_age: 'Độ tuổi (năm)',
  chart_axis_density: 'Mật độ xác suất',
  chart_remaining_area: 'Xác suất thời gian còn lại',

  // Equivalents
  filter_all: 'Tất cả Đơn vị',
  filter_seconds: 'Giây đến Giờ',
  filter_days: 'Ngày đến Tuần',
  filter_years: 'Năm & Cột mốc',

  equiv_heartbeats_unit: 'nhịp đập trái tim',
  equiv_heartbeats_rate: 'ở mức nhịp tim nghỉ 70 nhịp/phút',
  equiv_breaths_unit: 'nhịp thở nhẹ nhàng',
  equiv_breaths_rate: 'với tần suất 16 nhịp/phút',
  equiv_births_unit: 'em bé chào đời trên thế giới',
  equiv_births_rate: 'tương đương ~4.3 sinh linh mới mỗi giây',
  equiv_songs_unit: 'bài hát lắng nghe',
  equiv_songs_rate: 'với 10 bài hát mỗi ngày',
  equiv_movies_unit: 'bộ phim thưởng thức',
  equiv_movies_rate: 'với 1 bộ phim cuối tuần (52 phim/năm)',
  equiv_coffees_unit: 'tách cà phê / tách trà ấm',
  equiv_coffees_rate: 'trung bình 1.5 tách mỗi ngày',
  equiv_meals_unit: 'bữa cơm gia đình ấm cúng',
  equiv_meals_rate: 'với {meals} bữa ăn mỗi ngày',
  equiv_full_moons_unit: 'đêm trăng tròn ngắm nhìn',
  equiv_full_moons_rate: 'chu kỳ mặt trăng 29.53 ngày',
  equiv_sunrises_unit: 'bình minh & hoàng hôn',
  equiv_sunrises_rate: '365.25 ngày mỗi năm dương lịch',
  equiv_weekends_unit: 'ngày cuối tuần thảnh thơi',
  equiv_weekends_rate: '52.18 ngày cuối tuần mỗi năm',
  equiv_books_unit: 'cuốn sách đã đọc hết',
  equiv_books_rate: 'với tốc độ {books} cuốn sách/năm',
  equiv_sleeps_unit: 'giấc ngủ nướng 9 tiếng trọn vẹn',
  equiv_sleeps_rate: '1 giấc ngủ sâu phục hồi mỗi tuần',
  equiv_seasons_unit: 'mùa xuân hạ thu đông đi qua',
  equiv_seasons_rate: '4 mùa tuần hoàn của đất trời',
  equiv_vacations_unit: 'chuyến phiêu lưu & du lịch',
  equiv_vacations_rate: 'với 2 chuyến đi lớn mỗi năm',
  equiv_friends_unit: 'buổi tối hàn huyên cùng bạn cũ',
  equiv_friends_rate: 'với 6 dịp tri kỷ tâm tình mỗi năm',
  equiv_birthdays_unit: 'lễ sinh nhật thổi nến',
  equiv_birthdays_rate: 'mỗi năm một lần kỷ niệm',
  equiv_lunar_new_years_unit: 'mùa Tết Nguyên Đán đoàn viên',
  equiv_lunar_new_years_rate: 'khoảnh khắc giao thừa thiêng liêng',
  equiv_world_cups_unit: 'kỳ World Cup & Olympic',
  equiv_world_cups_rate: 'lễ hội thể thao 4 năm một lần',

  // Countdown
  countdown_years: 'NĂM',
  countdown_days: 'NGÀY',
  countdown_hours: 'GIỜ',
  countdown_minutes: 'PHÚT',
  countdown_seconds: 'GIÂY',
  btn_hide_countdown: 'Ẩn Đồng Hồ',
  btn_show_countdown: 'Hiện Đồng Hồ',

  // Share Modal
  share_modal_title: 'Chia Sẻ Góc Nhìn Cuộc Đời',
  share_link_label: 'Đường dẫn Chia sẻ (Lưu trọn vẹn mọi thông số)',
  btn_copy_link: 'Sao chép Liên kết',
  copied_success: 'Đã sao chép liên kết vào clipboard!',
  share_image_title: 'Xem Trước Ảnh Thẻ 1200 × 630',
  share_image_desc: 'Ảnh PNG độ nét cao tạo hoàn toàn trực tiếp trong trình duyệt, không gửi dữ liệu ra ngoài.',
  btn_download_png: 'Tải Ảnh Chia Sẻ (PNG)',
  close_modal: 'Đóng',

  // Disclaimer
  disclaimer_title: 'Triết Lý & Khước Từ Trách Nhiệm',
  disclaimer_body:
    'Ứng dụng này là một công cụ chiêm nghiệm triết học, nhằm định hình thời gian sống còn lại như một "sức mua" dành cho những trải nghiệm ý nghĩa. Đây hoàn toàn không phải là lời khuyên y tế, bảo hiểm hay tài chính. Mô hình phân phối chuẩn và Gompertz cung cấp bức tranh thống kê minh họa, còn cảm nhận thời gian dựa trên giả thuyết logarit Weber-Fechner. Hãy trân trọng từng giờ phút thức tỉnh và chi tiêu cuộc đời một cách sâu sắc.',
};

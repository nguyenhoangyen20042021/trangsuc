import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Stack
} from '@mui/material';
import {
  Edit as EditIcon,
  Block as BlockIcon,
  CheckCircle as ActiveIcon
} from '@mui/icons-material';
import { LuxuryUserIcon } from '../../components/icons/ProductIcons';
import { getStoredUsers, fetchUsers, createUser } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const INITIAL_USERS = [
  { id: 1, username: 'admin', fullName: 'Quản Trị Viên Cao Cấp', email: 'admin@lunabelle.vn', phone: '0901234567', role: 'ADMIN', active: true },
  { id: 2, username: 'nhanvien', fullName: 'Nguyễn Văn Nhân Viên', email: 'staff@lunabelle.vn', phone: '0912345678', role: 'STAFF', active: true },
  { id: 3, username: 'khachhang', fullName: 'Lê Hoàng Yến Nhi', email: 'yennhi@gmail.com', phone: '0987654321', role: 'CUSTOMER', active: true },
  { id: 4, username: 'minhtri', fullName: 'Trần Minh Trí', email: 'minhtri@gmail.com', phone: '0978999888', role: 'CUSTOMER', active: true },
];

export const AdminUsersPage = () => {
  const { notify } = useAuth();
  const [users, setUsers] = useState(getStoredUsers);

  useEffect(() => {
    fetchUsers().then(data => {
      if (data && data.length) setUsers(data);
    });
  }, []);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    fullName: '',
    email: '',
    phone: '',
    role: 'CUSTOMER'
  });

  const handleOpenAdd = () => {
    setEditingUser(null);
    setFormData({ username: '', fullName: '', email: '', phone: '', role: 'CUSTOMER' });
    setOpenDialog(true);
  };

  const handleOpenEdit = (u) => {
    setEditingUser(u);
    setFormData({ username: u.username, fullName: u.fullName, email: u.email, phone: u.phone, role: u.role });
    setOpenDialog(true);
  };

  const handleToggleStatus = (id, name, active) => {
    setUsers(prev => prev.map(u => (u.id === id ? { ...u, active: !active } : u)));
    notify(`Đã ${active ? 'khóa' : 'mở khóa'} tài khoản "${name}"!`, 'info');
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.username.trim() || !formData.fullName.trim()) {
      notify('Vui lòng điền đầy đủ tên đăng nhập và họ tên!', 'warning');
      return;
    }

    if (editingUser) {
      setUsers(prev => prev.map(u => (u.id === editingUser.id ? { ...u, ...formData } : u)));
      notify(`Đã cập nhật tài khoản "${formData.fullName}"!`, 'success');
    } else {
      const newUser = await createUser(formData);
      setUsers(prev => [...prev, newUser]);
      notify(`Đã tạo tài khoản người dùng mới thành công!`, 'success');
    }
    setOpenDialog(false);
  };

  return (
    <Box sx={{ pb: 6 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3.5, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, color: '#2C1F20' }}>
            Người Dùng & Phân Quyền Vai Trò
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
            Quản trị tài khoản Quản Trị Viên (ADMIN), Nhân Viên (STAFF) và Khách Hàng (CUSTOMER).
          </Typography>
        </Box>

        <Button
          variant="contained"
          color="primary"
          startIcon={<LuxuryUserIcon sx={{ fontSize: 18 }} />}
          onClick={handleOpenAdd}
          sx={{ borderRadius: 20, px: 3, fontWeight: 700 }}
        >
          Thêm Tài Khoản Mới
        </Button>
      </Box>

      <Paper elevation={0} sx={{ borderRadius: 3, border: '1px solid rgba(0,0,0,0.08)', bgcolor: '#FFFFFF', overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead sx={{ bgcolor: '#F9FAFB' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>Tên Đăng Nhập</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Họ Và Tên</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Email</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Số Điện Thoại</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Vai Trò (Role)</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Trạng Thái</TableCell>
                <TableCell align="center" sx={{ fontWeight: 700 }}>Thao Tác</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {users.map((u) => (
                <TableRow key={u.id} hover>
                  <TableCell sx={{ fontWeight: 700, color: 'text.primary' }}>
                    {u.username}
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>{u.fullName}</TableCell>
                  <TableCell>{u.email}</TableCell>
                  <TableCell>{u.phone}</TableCell>
                  <TableCell>
                    <Chip
                      label={u.role}
                      color={u.role === 'ADMIN' ? 'error' : (u.role === 'STAFF' ? 'primary' : 'default')}
                      size="small"
                      sx={{ fontWeight: 700 }}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={u.active ? 'Hoạt động' : 'Bị khóa'}
                      color={u.active ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Stack direction="row" spacing={1} sx={{ justifyContent: 'center' }}>
                      <IconButton size="small" color="primary" onClick={() => handleOpenEdit(u)} title="Đổi quyền hoặc sửa thông tin">
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" color={u.active ? 'error' : 'success'} onClick={() => handleToggleStatus(u.id, u.fullName, u.active)} title={u.active ? 'Khóa tài khoản' : 'Mở khóa'}>
                        {u.active ? <BlockIcon fontSize="small" /> : <ActiveIcon fontSize="small" />}
                      </IconButton>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* User Form Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 700 }}>
          {editingUser ? 'Cập Nhật Tài Khoản' : 'Thêm Người Dùng Mới'}
        </DialogTitle>
        <form onSubmit={handleSave}>
          <DialogContent>
            <Stack spacing={2.5}>
              <TextField
                required
                fullWidth
                label="Tên đăng nhập"
                value={formData.username}
                disabled={Boolean(editingUser)}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              />
              <TextField
                required
                fullWidth
                label="Họ và tên đầy đủ"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              />
              <TextField
                required
                fullWidth
                type="email"
                label="Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
              <TextField
                fullWidth
                label="Số điện thoại"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
              <TextField
                select
                fullWidth
                label="Phân quyền vai trò"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              >
                <MenuItem value="CUSTOMER">CUSTOMER (Khách hàng)</MenuItem>
                <MenuItem value="STAFF">STAFF (Nhân viên kinh doanh)</MenuItem>
                <MenuItem value="ADMIN">ADMIN (Quản trị viên toàn quyền)</MenuItem>
              </TextField>
            </Stack>
          </DialogContent>
          <DialogActions sx={{ p: 2.5 }}>
            <Button onClick={() => setOpenDialog(false)}>Hủy</Button>
            <Button type="submit" variant="contained" color="primary" sx={{ borderRadius: 20, px: 3, fontWeight: 700 }}>
              {editingUser ? 'Lưu Thay Đổi' : 'Tạo Tài Khoản'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

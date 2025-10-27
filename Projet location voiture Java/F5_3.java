import javax.swing.table.*;
import java.awt.*;
import javax.swing.*;
import java.sql.*;

public class F5_3 extends JFrame {
    JLabel l1 = new JLabel("Liste des utilisateurs");
    JTable tableUtilisateurs;
    DefaultTableModel tableModel;
    Connection connection;
    public F5_3() {
        super("Interface de gestion des utilisateurs");
        setSize(800, 800);
        setDefaultCloseOperation(JFrame.DISPOSE_ON_CLOSE);
        setLocationRelativeTo(null);
        try {
            connection = DriverManager.getConnection("jdbc:mysql://localhost:3306/location_voitures", "root", "");
        } catch (SQLException e) {
            JOptionPane.showMessageDialog(this, "Erreur de connexion à la base de données : " + e.getMessage(), "Erreur", JOptionPane.ERROR_MESSAGE);
            return;
        }
        JPanel p5_3 = new JPanel();
        p5_3.setLayout(new BorderLayout());
        p5_3.setBackground(new Color(0, 57, 99));
        JLabel titre = new JLabel("Gestion des utilisateurs", SwingConstants.CENTER);
        titre.setFont(new Font("Arial", Font.BOLD, 22));
        titre.setForeground(new Color(229, 229, 229));
        titre.setBorder(BorderFactory.createEmptyBorder(20, 10, 20, 10));
        p5_3.add(titre, BorderLayout.NORTH);
        JPanel centre = new JPanel();
        centre.setLayout(new GridBagLayout());
        centre.setOpaque(false);
        GridBagConstraints gbc = new GridBagConstraints();
        gbc.insets = new Insets(15, 20, 15, 20);
        l1.setFont(new Font("Arial", Font.PLAIN, 16));
        l1.setForeground(new Color(229, 229, 229));
        tableModel = new DefaultTableModel(new String[]{"Nom et prenom", "Mot de passe", "Adresse", "Email", "Role","ID"}, 0);
        tableUtilisateurs = new JTable(tableModel);
        styliserTableau(tableUtilisateurs); // Appliquer le style au tableau
        JScrollPane scrollPane = new JScrollPane(tableUtilisateurs);
        scrollPane.setPreferredSize(new Dimension(600, 200));
        gbc.gridx = 0;
        gbc.gridy = 0;
        gbc.gridwidth = 2;
        centre.add(scrollPane, gbc);
        p5_3.add(centre, BorderLayout.CENTER);
        JPanel footerPanel = new JPanel(new BorderLayout());
        footerPanel.setBackground(new Color(0, 57, 99));
        JLabel footer = new JLabel("\u00a9 2025 - A.Lakhal - A.Khmiri - F.Aissaoui - R.Khlif", SwingConstants.CENTER);
        footer.setFont(new Font("Arial", Font.ITALIC, 12));
        footer.setForeground(new Color(252, 208, 55));
        footer.setBorder(BorderFactory.createEmptyBorder(10, 0, 10, 0));
        footerPanel.add(footer, BorderLayout.CENTER);
        p5_3.add(footerPanel, BorderLayout.SOUTH);
        setContentPane(p5_3);
        afficherUtilisateurs();
    }
    public void afficherUtilisateurs() {
        try {
            String query = "SELECT * FROM personnes";
            PreparedStatement ps = connection.prepareStatement(query);
            ResultSet rs = ps.executeQuery();
            tableModel.setRowCount(0);
            while (rs.next()) {
                String np = rs.getString("Nom_et_prenom");
                String mdp = rs.getString("Mot_de_Passe");
                String adr = rs.getString("Adresse");
                String email = rs.getString("Mail");
                String role = rs.getString("Role");
                int id = rs.getInt("ID");
                tableModel.addRow(new Object[]{np, mdp, adr, email, role, id});
            }
            rs.close();
            ps.close();
        } catch (SQLException ex) {
            JOptionPane.showMessageDialog(this, "Erreur SQL : " + ex.getMessage(), "Erreur", JOptionPane.ERROR_MESSAGE);
        }
    }
    private void styliserTableau(JTable table) {
        table.setFont(new Font("Arial", Font.PLAIN, 14));
        table.setRowHeight(25);
        table.setBackground(new Color(229, 229, 229));
        table.setForeground(new Color(0, 57, 99));
        table.setSelectionBackground(new Color(0, 142, 197));
        table.setSelectionForeground(Color.WHITE);
        table.setGridColor(new Color(252, 208, 55));
        JTableHeader header = table.getTableHeader();
        header.setFont(new Font("Arial", Font.BOLD, 16));
        header.setBackground(new Color(0, 57, 99));
        header.setForeground(new Color(252, 208, 55));
        header.setReorderingAllowed(false);
    }
    public static void main(String[] args) {
        SwingUtilities.invokeLater(() -> {
            new F5_3().setVisible(true);
        });
    }
}
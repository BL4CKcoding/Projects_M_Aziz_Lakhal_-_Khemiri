import javax.swing.table.*;
import java.awt.*;
import javax.swing.*;
import java.awt.event.*;
import java.sql.*;

public class F5_2 extends JFrame {
    public String selectedOption;
    JLabel l1 = new JLabel("Voici la liste des voitures");
    JTextArea t1 = new JTextArea(20, 40);
    JTable tableVoitures;
    DefaultTableModel tableModel;
    Connection connection;
    public F5_2(String selectedOption) {
        super("Interface de location de voiture");
        this.selectedOption = selectedOption;
        setSize(1000, 1000);
        setDefaultCloseOperation(JFrame.DISPOSE_ON_CLOSE);
        setLocationRelativeTo(null);
        try {
            connection = DriverManager.getConnection("jdbc:mysql://localhost:3306/location_voitures", "root", "");
        } catch (SQLException e) {
            JOptionPane.showMessageDialog(this, "Erreur de connexion à la base de données : " + e.getMessage(), "Erreur", JOptionPane.ERROR_MESSAGE);
            return;
        }
        JPanel p5_2 = new JPanel();
        p5_2.setLayout(new BorderLayout());
        p5_2.setBackground(new Color(0, 57, 99));
        l1.setFont(new Font("Arial", Font.BOLD, 22));
        l1.setForeground(new Color(229, 229, 229));
        tableModel = new DefaultTableModel(new String[]{"Marque", "Modele", "Age", "Prix", "Référence", "Dispo", "ID Locataire"}, 0);
        tableVoitures = new JTable(tableModel);
        styliserTableau(tableVoitures); // Appliquer le style au tableau
        JScrollPane scrollPane = new JScrollPane(tableVoitures);
        scrollPane.setPreferredSize(new Dimension(600, 200));
        JPanel centre = new JPanel();
        centre.setLayout(new GridBagLayout());
        centre.setOpaque(false);
        GridBagConstraints gbc = new GridBagConstraints();
        gbc.insets = new Insets(15, 20, 15, 20);
        gbc.gridx = 0;
        gbc.gridy = 0;
        gbc.gridwidth = 2;
        centre.add(l1, gbc);
        gbc.gridx = 0;
        gbc.gridy = 1;
        centre.add(scrollPane, gbc);
        p5_2.add(centre, BorderLayout.NORTH);
        JPanel footerPanel = new JPanel(new BorderLayout());
        footerPanel.setBackground(new Color(0, 57, 99));
        JLabel footer = new JLabel("\u00a9 2025 - A.Lakhal - A.Khmiri - F.Aissaoui - R.Khlif", SwingConstants.CENTER);
        footer.setFont(new Font("Arial", Font.ITALIC, 12));
        footer.setForeground(new Color(252, 208, 55));
        footer.setBorder(BorderFactory.createEmptyBorder(10, 0, 10, 0));
        footerPanel.add(footer, BorderLayout.CENTER);
        p5_2.add(footerPanel, BorderLayout.SOUTH);
        chargerDonneesTable(selectedOption);
        setContentPane(p5_2);
    }
    private void chargerDonneesTable(String selectedOption) {
        try {
            String req;
            if ("Tous".equals(selectedOption)) {
                req = "SELECT * FROM voitures";
            } else {
                req = "SELECT * FROM voitures ORDER BY " + selectedOption;
            }
            PreparedStatement ps = connection.prepareStatement(req);
            ResultSet rs = ps.executeQuery();
            tableModel.setRowCount(0);
            while (rs.next()) {
                int ref = rs.getInt("Ref");
                String marque = rs.getString("Marque");
                String modele = rs.getString("Modele");
                int age = rs.getInt("Age");
                float prix = rs.getFloat("Prix");
                boolean disponible = rs.getBoolean("Dispo");
                int idLocataire = rs.getInt("ID_locataire");
                String disponibiliteText = disponible ? "Disponible" : "Indisponible";
                tableModel.addRow(new Object[]{marque, modele, age, prix, ref, disponibiliteText, idLocataire});
            }
        } catch (SQLException e) {
            JOptionPane.showMessageDialog(this, "Erreur lors de l'exécution de la requête : " + e.getMessage(), "Erreur", JOptionPane.ERROR_MESSAGE);
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
}
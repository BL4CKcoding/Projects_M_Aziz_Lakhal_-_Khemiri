import javax.swing.*;
import java.awt.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.sql.DriverManager;
import java.sql.Connection;

public class F1 extends JFrame implements ActionListener{
    JButton user = new JButton("Utilisateur");
    JButton admin = new JButton("Administrateur");
    public F1(){
        super("Location Voiture");
        setSize(600,400);
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setLocationRelativeTo(null);
        JPanel p = new JPanel(new BorderLayout());
        p.setBackground(new Color(0, 57, 99));
        JLabel titleLabel = new JLabel("Bienvenue dans l'application de location de voitures", SwingConstants.CENTER);
        titleLabel.setFont(new Font("Arial", Font.BOLD, 22));
        titleLabel.setForeground(new Color(229, 229, 229));
        titleLabel.setBorder(BorderFactory.createEmptyBorder(20, 10, 20, 10));
        p.add(titleLabel, BorderLayout.NORTH);
        JPanel bp = new JPanel(new GridLayout(1, 2, 20, 0));
        bp.setBorder(BorderFactory.createEmptyBorder(20, 40, 20, 40));
        bp.setOpaque(false);
        Color buttonColor = new Color(0, 142, 197);
        bouton(user, buttonColor, Color.WHITE);
        bouton(admin, buttonColor, Color.WHITE);
        bp.add(user);
        bp.add(admin);
        p.add(bp, BorderLayout.CENTER);
        JLabel footer = new JLabel("\u00a9 2025 - A.Lakhal - A.Khmiri - F.Aissaoui - R.Khlif", SwingConstants.CENTER);
        footer.setFont(new Font("Arial", Font.ITALIC, 12));
        footer.setForeground(new Color(252, 208, 55)); // #FCD037 - Jaune
        footer.setBorder(BorderFactory.createEmptyBorder(10, 0, 10, 0));
        p.add(footer, BorderLayout.SOUTH);
        user.addActionListener(this);
        admin.addActionListener(this);
        setContentPane(p);
    }
    public void actionPerformed(ActionEvent e){
        if (e.getSource() == user){
            F2_1 f2_1 = new F2_1();
            f2_1.setVisible(true);
        }
        if (e.getSource() == admin){
            F2_2 f2_2 = new F2_2();
            f2_2.setVisible(true);
        }
    }
    private void bouton(JButton bouton, Color bgColor, Color fgColor) {
        bouton.setFont(new Font("Arial", Font.BOLD, 14));
        bouton.setBackground(bgColor);
        bouton.setForeground(fgColor);
        bouton.setFocusPainted(false);
        bouton.setBorder(BorderFactory.createLineBorder(new Color(0, 57, 99)));
    }
    public static void main(String[] args) {
        try {
            Connection connection = DriverManager.getConnection("jdbc:mysql://localhost:3306/location_voitures", "root", "");
        }catch (Exception e) {
            e.printStackTrace();
        }

        F1 f1 = new F1();
        f1.setVisible(true);
    }
}